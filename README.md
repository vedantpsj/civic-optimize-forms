# Limit Number of response

## Introduction

Uses @oneblink/sdk to mark the forms publish end date, when it reaches a certain number of submissions.

## Loom Walkthrough

[View Loom Video Here](https://www.loom.com/share/653651326a874a0b8e57abc478433bfa)

## Usage

Civicplus along with @oneblink/cli NodeJS SDK helps us create API's which can be used for data lookups, data sets, webhooks.

One can create API Hoisting in Civicplus dashboard/ host API'S manually.

Deploy code

```
civicplus api deploy
```

Serve locally

```
civicplus api serve

```

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

### Getting started with using CivicOptimize Webhooks

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

### Use variables with oneblink

One can add variables in the .blinkmrc.json

```

   "variables": {
    "FORMS_KEY": "XXX",
    "FORMS_SECRET": "XXX",
    "WEBHOOK_SECRET": "XXX"
    }

```

## Technologies

1. Oneblink
2. NodeJS

## Reference Links

[Forms Module](https://oneblink.github.io/sdk-node-js/classes/oneblink.Forms.html)

[getForm](https://oneblink.github.io/sdk-node-js/classes/oneblink.Forms.html#getForm)

[getSubmissionData](https://oneblink.github.io/sdk-node-js/classes/oneblink.Forms.html#getSubmissionData)

[updateForm](https://oneblink.github.io/sdk-node-js/classes/oneblink.Forms.html#updateForm)

## Secrets

Add secrets to .blinkmrc.json

```
 "FORMS_KEY": "XXX",
 "FORMS_SECRET": "XXX",
 "WEBHOOK_SECRET": "XXX"
```

## Dev notes

Make sure to update the form submission events with secret.
