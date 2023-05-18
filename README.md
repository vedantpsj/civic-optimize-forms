# Theater Rentals inventory

## Introduction

Uses @oneblink/sdk to manage inventory based based on admin form and a user form from which user can view and purchase inventory.

## Loom Walkthrough

[View Loom Video Here](https://www.loom.com/share/bcd98d575bd743909db15101400d0a6d)

## Usage

Civicplus along with @oneblink/cli NodeJS SDK helps us create API's which can be used for data lookups, data sets, webhooks and form validators.

One can create API Hoisting in Civicplus dashboard/ host API'S manually.

Deploy code

```
civicplus api deploy
```

Serve locally

```
civicplus api serve

```

### JSON file on server

A json file on a server with read/write access need to be provided as file on civic-plus server has only read access and outside environment can not overwrite this file using filesystem (fs).

## Setup

### Install @oneblink/cli

1. install @oneblink/cli globally

```
npm i -g  @oneblink/cli
```

2. Login Using Email

```
civicplus login --username XXXXXXX
```

3. Change Scope of the project

```
civicplus api scope XXXXXXX
```

4. Deploy code

```
civicplus api deploy
```

5. Serve locally

```
civicplus api serve

```

### Install @oneblink/sdk

1. install @oneblink/sdk

```
npm i -g  @oneblink/sdk
```

## Getting started with using CivicOptimize Option Sets

1. Use a sample JSON as sample.json file in the project.

2. Create a routing file.

3. Add module.exports function in the routing file.

4. Configure .blinkmrc.json

```
    {
      "route": "/ROUTE_PATH",
      "module": "./PATH_TO_MODULE_FILE"
    }

```

5. Serve the code locally and test the API endpoint.

6. Deploy the code using.

```
civicplus api deploy
```

7. In the CIVIC PLUS DASHBOARD, Go to Developer tools > Option Sets > Create New > Add Option set Label and configure the path to the created API endpoint.

8. Go to the Forms > Builder, Select the field you want to add option set to. Go to options, Select Use Predefined. Select the label of your added option set in this.

## Getting started with using CivicOptimize Lookups

1. Use a sample JSON as sample.json file in the project.

2. Create a routing file.

3. Add module.exports function in the routing file.

4. Configure .blinkmrc.json

```
    {
      "route": "/ROUTE_PATH",
      "module": "./PATH_TO_MODULE_FILE"
    }

```

5. Serve the code locally and test the API endpoint.

6. Deploy the code using.

```
civicplus api deploy
```

7. In the CIVIC PLUS DASHBOARD, Go to Developer tools > Lookups > Create New > Add Lookup Label and configure the path to the created API endpoint.

8. Go to the Forms > Builder, Select the field you want to add lookup to. Enable data lookup / Element lookup. Select the label of your added option set in this.

## Getting started with using CivicOptimize Webhooks

1. Create a routing file.

2. Add module.exports function in the routing file.

3. Configure .blinkmrc.json

```
    {
      "route": "/ROUTE_PATH",
      "module": "./PATH_TO_MODULE_FILE"
    }

```

4. Deploy the code using

```
civicplus api deploy
```

4. In the CIVIC PLUS DASHBOARD, Go to Forms > Workflow > Submission Event > Select Event type - Webhook: Hosted API. Select Hoisted API. Select Route. Add a secret. Save

5. Make sure to validate this secret in the webhook.

## Use variables with oneblink

One can add variables in the .blinkmrc.json

```
   "variables": {
      "accessKey": "XXX",
      "secretKey": "XXX",
      "WEBHOOK_SECRET": "XXX"
    }

```

## Technologies

1. Oneblink
2. NodeJS

## Reference Links

[Look ups overview](https://www.civicoptimize.civicplus.help/hc/en-us/articles/360046957993)

[Sample Example](https://github.com/oneblink/cli/blob/master/examples/api/lookup/)

[Calculation Element](https://www.civicoptimize.civicplus.help/hc/en-us/articles/360046852414-Calculation-Element)

[getSubmissionData](https://oneblink.github.io/sdk-node-js/classes/oneblink.Forms.html#getSubmissionData)

[validated form example](https://github.com/oneblink/cli/blob/master/examples/api/form-server-validation/src/validate-form.js)

[axios](https://www.npmjs.com/package/axios)

## Dev notes

1. One has only read access to the civicplus server and can not write a file on it.

2. I have used a JSON file on a server which acts as dataset for the api's.
   Axios is used to pull and push this JSON file.

3. Issue with getting the form response via web-hook using 'oneblink/sdk'.
   (Error while initializing form Error [OneBlinkAPIError]: Could not find Key)
