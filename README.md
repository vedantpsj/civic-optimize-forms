# Theater Rentals inventory

## Introduction

Uses NodeJs and VanillaJS with HTML to manage inventory.

## Loom Walkthrough

[View Loom Video Here](https://www.loom.com/share/61b8e7d84a7d404bacb14277f9c043a7)

## Usage

NodeJs with express is used for server-side code and VanillaJs with Html is used for client-side.

### JSON file on server

A json file on a server with read/write access is kept on the server which is used as the data-source for the inventory.

## Setup

### Backend

1. Go to server folder

```
cd server
```

2. Install npm dependencies

```
npm i
```

3. Run the code

```
npm run start
```

### Frontend

1. Go to client folder

```
cd client
```

2. Install npm dependencies

```
npm i
```

### Deployment

1. Login into droplet

```
ssh@XXX.XXX.XXX.XXX
```

2. clone the repo

```
git clone XXXX
```

3. [Setup Nginx server for nodeJS](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)

4. Go to server folder and run the code in pm2

```
cd server && npm i && pm2 start index.hjs
```

5. Copy the client side files and folder to /var/www/html folder

```
cp -r ~/civic-optimize-forms/client/.  /var/www/html
```

## Technologies

1. NodeJS
2. VanillaJS
3. Bootstrap
4. Axios
5. SCSS

## Reference Links

[NodeJS](https://nodejs.org/en)

[Bootstrap](https://getbootstrap.com/)

[Axios](https://www.npmjs.com/package/axios)

[SCSS](https://sass-lang.com/)

[Setup Nginx server for NodeJS](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)

## Dev notes

1. Used digital ocean for the deployment on the droplet

2. Make sure to configure sudo nano /etc/nginx/sites-available/default according to the routes.

3. Added a automatic deployment file deploy.sh for making deployment easy and robust.
