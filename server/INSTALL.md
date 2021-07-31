Зависимости:
- ubuntu 20.04.01
- nginx 1.17.10
- python 3.9
- pipenv 11.9.0
- postgresql 12.7
- redis 5.0.7

Настройка сервиса основывается на данном туториале, советую ознакомить если воникнут проблемы. Основное различие - в нашем случае мы используем pipenv вместо pip и daphne вместо gunicorn
https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-18-04-ru

Первоначальная настройка сервера
https://www.digitalocean.com/community/tutorials/ubuntu-18-04-ru

```bash
sudo apt update
sudo apt install python3.9 python3.9-pip python3.9-dev libpq-dev postgresql postgresql-contrib nginx curl gcc pipenv git redis-server

sudo -u postgres psql
```
```sql
CREATE DATABASE CMD;
CREATE USER admin WITH PASSWORD 'password';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE cmd TO admin;
\q
```
```bash
mkdir ~/site
cd ~/site
git init
git remote add origin git@github.com:YOUR_REPOSITORY.git
git pull origin master
pipenv sync
```

Далее нужно создать и настроить файл ~/site/env.py
```python
DEBUG = False

DB_NAME = '' # НАЗВАНИЕ БАЗЫ ДАННЫХ
DB_USER = '' # ИМЯ ПОЛЬЗОВАТЕЛЯ БАЗЫ ДАННЫХ
DB_PASSWORD = '' # ПАРОЛЬ ПОЛЬЗОВАТЕЛЯ БАЗЫ ДАННЫХ

SECRET_KEY = '' # СЕКРЕТНЫЙ КЛЮЧ ДЖАНГО ПРОЕКТА

REDIS_PASSWORD = '' # ПАРОЛЬ РЕДИС

SERVER_DOMAINS = ['cmd-test.piterweb.ru', '45.84.226.37'] # ДОМЕН И IP СЕРВЕРА, ЗАМЕНИТЕ НА НУЖНЫЕ ЗНАЧЕНИЯ
MEDIA_ROOT_URL = 'https://cmd-test.piterweb.ru' # URL СЕРВЕРА ДЛЯ ВНЕШНЕГО ДОСТУПА, ЗАМЕНИТЕ НА НУЖНЫЕ ЗНАЧЕНИЯ
SERVER_URLS = ['https://cmd-test.piterweb.ru', 'https://45.84.226.37'] # ЮРЛ СЕРВЕРА И ЮРЛ IP, ЗАМЕНИТЕ НА НУЖНЫЕ ЗНАЧЕНИЯ
PATIENT_WIDGET_DOMAINS = ['piterweb.ru'] # ДОМЕНЫ САЙТОВ С ВИДЖЕТАМИ ПАЦИЕНТОВ, ЗАМЕНИТЕ НА НУЖНЫЕ ЗНАЧЕНИЯ
PATIENT_WIDGET_URLS = ['https://piterweb.ru'] # ЮРЛЫ САЙТОВ С ВИДЖЕТАМИ ПАЦИЕНТОВ, ЗАМЕНИТЕ НА НУЖНЫЕ ЗНАЧЕНИЯ

REDIS_HOST = '127.0.0.1'
REDIS_PORT = '6379'

ZADARMA_KEY = '' # КЛЮЧ АУТЕНТИФИКАЦИИ ZADARMA
ZADARMA_SECRET = '' # СЕКРЕТНЫЙ КЛЮЧ АУТЕНТИФИКАЦИИ ZADARMA
```
Также проверьте существование папок ~/site/public/media ~/site/public/meta (если нет - создайте) и файла ~/site/resources/info.log (если нет - создайте)


```bash
sudo nano /etc/systemd/system/daphne.socket
```
```
[Unit]
Description=daphne socket

[Socket]
ListenStream=/run/daphne.sock

[Install]
WantedBy=daphne.target
```
Узнайте путь до VIRTUALENV и запишите его куда нибудь, он в дальнейшем понадобится
```bash
pipenv --venv
```
```bash
sudo nano /etc/systemd/system/daphne.service
```
```
[Unit]
Description=daphne daemon
Requires=daphne.socket
After=network.target

[Service]
User=admin
Group=www-data
WorkingDirectory=/home/admin/site
ExecStart=ПУТЬ VIRTUALENV/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          core.wsgi:application

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
```
Далее настроим nginx
```bash
sudo nano /etc/nginx/sites-available/cmd
```
```
server {
    listen 80;
    server_name server_domain_or_IP;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/admin/site;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/daphne.sock;
    }
}
```
```bash
sudo systemctl start redis-server
sudo systemctl enable redis-server
```
```bash
sudo ln -s /etc/nginx/sites-available/cmd /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
```

Далее для удобства зайдите в ~/.bashrc и добавьте там несколько функций, которые облегчат вам работу
```bash
sudo nano ~/.bashrc
```
setenv - переходит в папку сайта и включает venv, gitpull загружает изменения из гит, обновляет статические файлы и перезагружает сервер, restart - просто перезагружает сервер, и django - позволяет быстро использовать нужные команды в django проекте
```
setenv() {
        cd ~/site
        pipenv shell
}

gitpull() {
        git pull origin main
        pipenv run python3 ./manage.py collectstatic
        sudo systemctl restart daphne
}

restart() {
        sudo systemctl restart daphne
}

django() {
        pipenv run python3 ./manage.py "$@"
}
```
Далее нужно подготовить проект к запуску, для этого используйте
```bash
setenv
django collectstatic
django makemgirations
django migrate
django createsuperuser
restart
```
Всё, ваш проект должен быть доступен по выбранному доменнму имени.
Далее вам нужно будет настроить ssl сертификат, что можно легко и быстро сделать через certbot
