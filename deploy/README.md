# Ubuntu + nginx — consultancyba.com

Statik EN/TR kurumsal sitesini Ubuntu sunucuda nginx + PHP-FPM ile yayınlama rehberi.

## Gereksinimler

- Ubuntu 22.04 / 24.04 LTS
- Alan adı DNS kaydı sunucu IP'sine yönlendirilmiş (`consultancyba.com`, `www.consultancyba.com`)
- SSH erişimi

## Hızlı kurulum

Sunucuda root veya sudo yetkisiyle:

```bash
# 1) Repoyu klonla
sudo mkdir -p /home/sites
sudo git clone https://github.com/etuncay/consultancyba.com.git /home/sites/consultancyba.com

# 2) Kurulum betiğini çalıştır
cd /home/sites/consultancyba.com
sudo bash deploy/ubuntu-setup.sh
```

Betik nginx, PHP-FPM kurar, site config'ini kopyalar, izinleri ayarlar ve HTTP üzerinden test eder.

## Manuel kurulum

### 1. Paketler

```bash
sudo apt update
sudo apt install -y nginx git php-fpm php-cli php-mbstring
```

### 2. Site dosyaları

```bash
sudo mkdir -p /home/sites/consultancyba.com
sudo git clone https://github.com/etuncay/consultancyba.com.git /home/sites/consultancyba.com
sudo chown -R www-data:www-data /home/sites/consultancyba.com
sudo find /home/sites/consultancyba.com -type d -exec chmod 755 {} \;
sudo find /home/sites/consultancyba.com -type f -exec chmod 644 {} \;
```

### 3. nginx site config

```bash
sudo cp /home/sites/consultancyba.com/deploy/nginx/consultancyba.com.conf /etc/nginx/sites-available/consultancyba.com

# PHP-FPM socket yolunu sisteme göre ayarla (ör. php8.1-fpm.sock veya php8.3-fpm.sock)
PHP_SOCK=$(find /run/php /var/run/php -name 'php*-fpm.sock' | head -1)
sudo sed -i "s|__PHP_FPM_SOCK__|${PHP_SOCK}|g" /etc/nginx/sites-available/consultancyba.com

sudo ln -sf /etc/nginx/sites-available/consultancyba.com /etc/nginx/sites-enabled/consultancyba.com
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Tarayıcıda `http://SUNUCU_IP/` veya `http://consultancyba.com/` açın.

### 4. HTTPS (Let's Encrypt)

DNS hazır olduktan sonra:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d consultancyba.com -d www.consultancyba.com
```

Yenileme otomatik (`certbot renew` systemd timer).

## Site yapısı

- İngilizce sayfalar: `/`, `/about.html`, `/contact.html`, vb.
- Türkçe sayfalar: `/tr/`, `/tr/about.html`, `/tr/contact.html`, vb.
- İletişim formu: `assets/contact.php` (PHP-FPM gerekir)
- Statik varlıklar: `assets/` (CSS, JS, görseller)

## İletişim formu (mail)

`assets/contact.php` sunucudan e-posta gönderir. PHP `mail()` veya SMTP relay yapılandırması gerekir:

```bash
# Basit relay örneği (msmtp veya postfix)
sudo apt install -y msmtp msmtp-mta
```

Alıcı adresi `assets/contact.php` içinde tanımlıdır (`consultancyba@outlook.com`).

## Güncelleme

```bash
cd /home/sites/consultancyba.com
sudo -u www-data git pull
# veya: sudo bash deploy/sync-site.sh
sudo systemctl reload nginx
```

Yerel makineden rsync ile:

```bash
rsync -avz --delete \
  --exclude '.git' \
  ./ user@SUNUCU:/home/sites/consultancyba.com/
ssh user@SUNUCU 'sudo chown -R www-data:www-data /home/sites/consultancyba.com && sudo systemctl reload nginx'
```

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `deploy/nginx/consultancyba.com.conf` | nginx site config (HTTP + HTTPS hazır) |
| `deploy/ubuntu-setup.sh` | İlk kurulum betiği |
| `deploy/sync-site.sh` | Git pull + nginx test/reload |

## Sorun giderme

```bash
# Config test
sudo nginx -t

# Loglar
sudo tail -f /var/log/nginx/consultancyba.com.error.log
sudo tail -f /var/log/nginx/consultancyba.com.access.log

# PHP-FPM durumu
sudo systemctl status php*-fpm
ls /run/php/

# İletişim formu 502 veriyorsa PHP-FPM socket yolunu kontrol et
grep fastcgi_pass /etc/nginx/sites-available/consultancyba.com
```

## Güvenlik duvarı

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
