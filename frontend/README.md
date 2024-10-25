# Setup

1.  Install nginx
```
sudo apt update
sudo apt install nginx -y
```

2. Remove default config:
```
sudo rm /etc/nginx/sites-enabled/default
```

3. Create config: `/etc/nginx/sites-available/react-app`
```
server {
    listen 80;
    server_name localhost;

    location / {
        root /var/www/react-app;
        try_files $uri /index.html;
    }
}
```

4. Enable site
```
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/
```

5. Add user group (perhaps not needed)
```
sudo usermod -aG system www-data
```

6. Enable nginx
```
sudo systemctl start nginx
sudo systemctl enable nginx
```

7.  Deploy using `deploy.sh` and then `local_deploy.sh` when you're ssh:ed to the machine!