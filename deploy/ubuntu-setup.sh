#!/usr/bin/env bash
# Ubuntu üzerinde consultancyba.com nginx kurulumu
set -euo pipefail

SITE_ROOT="/home/sites/consultancyba.com"
NGINX_AVAILABLE="/etc/nginx/sites-available/consultancyba.com"
NGINX_ENABLED="/etc/nginx/sites-enabled/consultancyba.com"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Bu betik root veya sudo ile çalıştırılmalı."
  exit 1
fi

echo "==> Paketler kuruluyor..."
apt update
apt install -y nginx git php-fpm php-cli php-mbstring

PHP_FPM_SOCK="$(find /run/php /var/run/php -name 'php*-fpm.sock' 2>/dev/null | head -1 || true)"
if [[ -z "${PHP_FPM_SOCK}" ]]; then
  echo "HATA: PHP-FPM socket bulunamadı. php-fpm servisini kontrol edin."
  exit 1
fi

echo "==> Site dizini hazırlanıyor: ${SITE_ROOT}"
mkdir -p "${SITE_ROOT}"

if [[ ! -f "${SITE_ROOT}/index.html" ]]; then
  if [[ -f "${REPO_ROOT}/index.html" ]]; then
    echo "    Repo dosyaları ${SITE_ROOT} altına kopyalanıyor..."
    rsync -a --delete \
      --exclude '.git' \
      "${REPO_ROOT}/" "${SITE_ROOT}/"
  else
    echo "HATA: ${SITE_ROOT}/index.html bulunamadı."
    echo "Önce repoyu klonlayın veya dosyaları ${SITE_ROOT} altına kopyalayın."
    exit 1
  fi
fi

echo "==> İzinler ayarlanıyor..."
chown -R www-data:www-data "${SITE_ROOT}"
find "${SITE_ROOT}" -type d -exec chmod 755 {} \;
find "${SITE_ROOT}" -type f -exec chmod 644 {} \;

echo "==> nginx site config kuruluyor..."
cp "${REPO_ROOT}/deploy/nginx/consultancyba.com.conf" "${NGINX_AVAILABLE}"
sed -i "s|__PHP_FPM_SOCK__|${PHP_FPM_SOCK}|g" "${NGINX_AVAILABLE}"
ln -sf "${NGINX_AVAILABLE}" "${NGINX_ENABLED}"
rm -f /etc/nginx/sites-enabled/default

echo "==> PHP-FPM etkinleştiriliyor..."
systemctl enable php-fpm
systemctl restart php-fpm

echo "==> nginx test..."
nginx -t

echo "==> nginx yeniden yükleniyor..."
systemctl enable nginx
systemctl reload nginx

echo ""
echo "Kurulum tamamlandı."
echo "  Site kökü     : ${SITE_ROOT}"
echo "  Config        : ${NGINX_AVAILABLE}"
echo "  PHP-FPM socket: ${PHP_FPM_SOCK}"
echo ""
echo "Test: http://$(hostname -I | awk '{print $1}')/"
echo ""
echo "HTTPS için (DNS hazırsa):"
echo "  apt install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d consultancyba.com -d www.consultancyba.com"
echo ""
echo "İletişim formu için sunucuda mail gönderimi yapılandırın (postfix/msmtp)."
