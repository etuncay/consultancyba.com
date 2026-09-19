<?php
declare(strict_types=1);

const RECIPIENT_EMAIL = 'consultancyba@outlook.com';
const FROM_EMAIL = 'website@consultancyba.com';
const MAX_POST_BYTES = 60000;
const MIN_FORM_TIME_MS = 1200;

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function redirect_to_form(string $language, string $status): void
{
    $target = $language === 'tr'
        ? '../tr/contact.html'
        : '../contact.html';

    header('Location: ' . $target . '?status=' . rawurlencode($status) . '#form-result', true, 303);
    exit;
}

function input_value(string $key): ?string
{
    if (!isset($_POST[$key])) {
        return '';
    }

    if (is_array($_POST[$key])) {
        return null;
    }

    return (string) $_POST[$key];
}

function normalized_host(string $host): string
{
    $host = strtolower(trim($host));
    $host = preg_replace('/:\\d+$/', '', $host) ?? $host;

    return strpos($host, 'www.') === 0 ? substr($host, 4) : $host;
}

function is_cross_site_request(): bool
{
    $requestHost = normalized_host((string) ($_SERVER['HTTP_HOST'] ?? ''));
    if ($requestHost === '') {
        return false;
    }

    foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $header) {
        $source = trim((string) ($_SERVER[$header] ?? ''));
        if ($source === '') {
            continue;
        }

        $sourceHost = parse_url($source, PHP_URL_HOST);
        if (!is_string($sourceHost) || $sourceHost === '') {
            continue;
        }

        return normalized_host($sourceHost) !== $requestHost;
    }

    return false;
}

function is_valid_utf8(string $value): bool
{
    return preg_match('//u', $value) === 1;
}

function text_length(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    $count = preg_match_all('/./us', $value, $matches);
    return $count === false ? strlen($value) : $count;
}

function clean_single_line(?string $value, int $maxLength): ?string
{
    if ($value === null || !is_valid_utf8($value)) {
        return null;
    }

    $value = trim($value);
    $value = preg_replace('/[\r\n\t]+/u', ' ', $value);
    $value = preg_replace('/\s{2,}/u', ' ', $value);

    if ($value === null || text_length($value) > $maxLength) {
        return null;
    }

    return $value;
}

function clean_message(?string $value, int $maxLength): ?string
{
    if ($value === null || !is_valid_utf8($value)) {
        return null;
    }

    $value = str_replace(["\r\n", "\r"], "\n", trim($value));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);

    if ($value === null || text_length($value) > $maxLength) {
        return null;
    }

    return $value;
}

$language = input_value('language') === 'tr' ? 'tr' : 'en';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    redirect_to_form($language, 'invalid');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength <= 0 || $contentLength > MAX_POST_BYTES) {
    redirect_to_form($language, 'invalid');
}

$contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
if ($contentType !== 'application/x-www-form-urlencoded') {
    redirect_to_form($language, 'invalid');
}

$website = input_value('website');
$formElapsed = input_value('form_elapsed');

if ($website === null || $formElapsed === null || !ctype_digit($formElapsed)) {
    redirect_to_form($language, 'invalid');
}

if ((int) $formElapsed < MIN_FORM_TIME_MS) {
    redirect_to_form($language, 'invalid');
}

if (trim($website) !== '' || is_cross_site_request()) {
    redirect_to_form($language, 'success');
}

$email = clean_single_line(input_value('email'), 254);
$name = clean_single_line(input_value('name'), 120);
$company = clean_single_line(input_value('company'), 160);
$country = clean_single_line(input_value('country'), 120);
$message = clean_message(input_value('message'), 4000);
$topic = clean_single_line(input_value('topic'), 40);

if ($email === null || $email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    redirect_to_form($language, 'invalid');
}

if ($name === null || $company === null || $country === null || $message === null || $topic === null) {
    redirect_to_form($language, 'invalid');
}

$topics = [
    'licensing' => ['en' => 'Licensing and establishment', 'tr' => 'Lisans ve kuruluş süreçleri'],
    'regulatory' => ['en' => 'Regulatory compliance and processes', 'tr' => 'Regülasyon, uyum ve regülatör süreçleri'],
    'technology' => ['en' => 'Technology and operational resilience', 'tr' => 'Teknoloji ve operasyonel dayanıklılık'],
    'it-risk' => ['en' => 'IT risk, regulation and assurance', 'tr' => 'IT risk, regülasyon ve denetim'],
    'financial-crime' => ['en' => 'Financial crime compliance', 'tr' => 'Finansal suçlar uyumu'],
    'strategy' => ['en' => 'Strategy and transformation', 'tr' => 'Strateji ve dönüşüm'],
    'emerging' => ['en' => 'An emerging issue', 'tr' => 'Gelişen bir konu'],
    'unsure' => ['en' => 'Not sure yet', 'tr' => 'Henüz emin değilim'],
];

if ($topic !== '' && !array_key_exists($topic, $topics)) {
    redirect_to_form($language, 'invalid');
}

$topicLabel = $topic === ''
    ? ($language === 'tr' ? 'Genel görüşme talebi' : 'General enquiry')
    : $topics[$topic][$language];

$subject = 'Consultancy BA | ' . $topicLabel;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$labels = $language === 'tr'
    ? [
        'name' => 'Ad Soyad',
        'company' => 'Kurum',
        'email' => 'E-posta',
        'country' => 'Faaliyet ülkesi / bölgesi',
        'topic' => 'Konu / hizmet alanı',
        'message' => 'Konu hakkında kısa bilgi',
    ]
    : [
        'name' => 'Name',
        'company' => 'Organisation',
        'email' => 'Email',
        'country' => 'Jurisdiction / region',
        'topic' => 'Topic / service area',
        'message' => 'Brief scope',
    ];

$bodyLines = [
    $labels['name'] . ': ' . ($name !== '' ? $name : '-'),
    $labels['company'] . ': ' . ($company !== '' ? $company : '-'),
    $labels['email'] . ': ' . $email,
    $labels['country'] . ': ' . ($country !== '' ? $country : '-'),
    $labels['topic'] . ': ' . $topicLabel,
    '',
    $labels['message'] . ':',
    $message !== '' ? $message : '-',
];

$body = implode("\r\n", $bodyLines);
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: quoted-printable',
    'From: Consultancy BA Website <' . FROM_EMAIL . '>',
    'Reply-To: ' . $email,
];

$sent = mail(
    RECIPIENT_EMAIL,
    $encodedSubject,
    quoted_printable_encode($body),
    implode("\r\n", $headers)
);

if (!$sent) {
    error_log('Consultancy BA contact form did not accept the message.');
    redirect_to_form($language, 'error');
}

error_log('Consultancy BA contact form message accepted for delivery.');

redirect_to_form($language, 'success');
