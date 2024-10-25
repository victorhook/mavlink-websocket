#!/bin/bash

APP=react-app
APP_TARGET_DIR=/var/www

echo "Moving build files to ${APP_TARGET_DIR}/${APP}..."
sudo rm -rf ${APP_TARGET_DIR}/${APP}
sudo mkdir -p ${APP_TARGET_DIR}/${APP}
sudo cp -r ${APP}/build/* ${APP_TARGET_DIR}/${APP}/

echo "Setting permissions..."
sudo chown -R www-data:www-data ${APP_TARGET_DIR}/${APP}
sudo chmod -R 755 ${APP_TARGET_DIR}/${APP}

echo "Restarting Nginx..."
sudo systemctl restart nginx

echo "Deployment complete!"
