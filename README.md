# Sandy.utah.gov Website Integrations

Automating code for Yelp and Now Playing Utah integrations

## To run

Clone this repo and run command `npm install` to ensure all dependencies are added.

`node index.js`

### Web Service Technologies

- Node.js: Server Side Code
- Request Module (depreciated looking to move to Axios instead)
- node-schedule Module

### JSON file on server

A json file on a server with read/write access is added to update tokens and automate the process

## Technologies

1. NodeJS
2. node-schedule
3. request

## Reference Links

[NodeJs](https://nodejs.org/en)

[node-schedule](https://www.npmjs.com/package/node-schedule/)

[request](https://www.npmjs.com/package/request)

## Dev notes

1. We have used node-schedule to automate cron jobs at specific times.
