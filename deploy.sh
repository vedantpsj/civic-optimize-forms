#BAKCEND
git pull -f
cd server
pm2 stop index.js
pm2 start index.js
sudo systemctl restart nginx

#FRONTEND
cp -r ~/civic-optimize-forms/client/.  /var/www/html
sudo systemctl restart nginx