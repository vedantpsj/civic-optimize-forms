# Theater Rentals

## Introduction

Uses NodeJs and ReactJS to manage inventory.

## Loom Walkthrough

[View Loom Video Here](https://www.loom.com/share/97f3c7ad2c344e1ab86063d3bf1eeef9)

## Usage

NodeJs with express is used for server-side code and ReactJS is used for client-side.

- Integrated with Civicplus [form](https://sandy-theater-rentals-upwork-2.app.transform.civicplus.com/forms/33162)

- Integrated with HCMS [Inventory items](https://content.civicplus.com/app/ut-sandycity/) and [Theater production](https://content.civicplus.com/app/ut-sandycity/)


## Documents

- [Theater Production](https://content.civicplus.com/api/content/ut-sandycity/docs#tag/Theater-Productions)

- [Inventory Item](https://content.civicplus.com/api/content/ut-sandycity/docs#tag/Inventory-Item)

- [Categories](https://content.civicplus.com/api/docs#tag/Categories)


### JSON file on server

A json file on a server with read/write access is kept on the server which is used as the data-source for the inventory.

[Theater Production](https://sandy-city.tech/api/production)

[Theater Rentals](https://sandy-city.tech/api)


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

3. Build project

```
npm run build
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
cp -r build/.  /var/www/html
```

## Technologies

1. NodeJS
2. ReactJS
3. Bootstrap
4. Axios

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
