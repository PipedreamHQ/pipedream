![pipedream](https://i.ibb.co/hB42XLK/github2.png)

<p align="center">
  <img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community">
  <img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social">
</p>

In this `README`, you'll learn how to [run any Node.js code on a schedule](#running-code-on-a-schedule) using [Pipedream](https://pipedream.com).

## Quickstart

**Watch [this short video](https://www.youtube.com/watch?v=PwjVR0dj-Hk&amp=) or step through the commands below**.

[Install the Pipedream CLI](https://docs.pipedream.com/cli/install/), then create a file with a single `console.log()` statement:

```bash
echo 'console.log("Hello, world")' > cronjob.js
```

And run that code once every 15 seconds:

```bash
pd deploy --run cronjob.js --timer --frequency 15s  # cron expressions also supported with --cron
```

You'll be asked to sign up or sign in to Pipedream at this step. Once that's done, the CLI should deploy your code.

Each time this script runs, it prints `"Hello, world"`. The CLI will automatically display new logs as the job runs. You can also press `Ctrl-C` and [listen for new logs](#logs) anytime by running:

```bash
pd logs cronjob-js
```

You can delete the job and all its logs by running:

```bash
pd delete cronjob-js
```

## Reference

<!--ts-->

- [Quickstart](#quickstart)
- [Reference](#reference)
- [Overview](#overview)
- [Running code on a schedule](#running-code-on-a-schedule)
  - [Run local Node code](#run-local-node-code)
  - [Run a script hosted on Github](#run-a-script-hosted-on-github)
  - [Create your own component](#create-your-own-component)
  - [Send an HTTP request](#send-an-http-request)
  - [Different schedule types](#different-schedule-types)
    - [Using the CLI](#using-the-cli)
    - [Using component props](#using-component-props)
  - [Notes and Limitations](#notes-and-limitations)
- [Using the REST API](#using-the-rest-api)
- [Example cron jobs](#example-cron-jobs)
- [Logs](#logs)
- [Consuming event data from your own app, outside Pipedream](#consuming-event-data-from-your-own-app-outside-pipedream)
- [Using npm packages](#using-npm-packages)
- [Pause a component](#pause-a-component)
- [Change a component's schedule](#change-a-components-schedule)
- [Delete a component](#delete-a-component)
- [Pricing](#pricing)
- [Limits](#limits)
- [Getting Support](#getting-support)

<!--te-->

## Overview

[Pipedream](https://pipedream.com) is a platform for running hosted, backend components.

**In this `README`, you'll learn what components are and how to use them to [run code on a schedule](#running-code-on-a-schedule)**. You can [run Node code directly on Pipedream](#run-local-node-code) or use components to [trigger external services](#send-an-http-request).

**Pipedream components are reusable Node.js modules that run code on specific events**: timers and HTTP requests. Components are [free to run](#pricing) and [simple to learn](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md). Here's a component that prints `"Hello, world"` once a minute:

```javascript
module.exports = {
  name: "cronjob",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "* * * * *",
      },
    },
  },
  async run() {
    console.log("Run any Node.js code here");
  },
};
```

You can use components to:

- [Run any Node code on a schedule](#running-code-on-a-schedule)
- Operate a [lightweight HTTP server](https://github.com/PipedreamHQ/pipedream/tree/master/interfaces/http#quickstart)
- Create [event sources](https://docs.pipedream.com/event-sources/) that collect data from services like Github or Stripe.

Components come with a [built-in key-value store](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#db), an interface for passing input via [props](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#props), and more. You deploy and manage components using Pipedream's [REST API](https://docs.pipedream.com/api/rest/), [CLI](https://docs.pipedream.com/cli/reference/), or [UI](https://pipedream.com/sources).

[Components can emit events](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#emit), which can be retrieved programmatically via [CLI](https://docs.pipedream.com/cli/reference/), [API](https://docs.pipedream.com/api/rest/) or [SSE](https://docs.pipedream.com/api/sse/). They can also trigger [Pipedream workflows](https://docs.pipedream.com/workflows/) on every event. For example, you can process items from an RSS feed and access the items via REST API, or trigger code to run on every new item using the SSE interface or a workflow. Components that emit events are called [**event sources**](https://docs.pipedream.com/event-sources/).

## Running code on a schedule

You can run code from a few different sources:

- [Upload a local file](#run-local-node-code)
- [Run a script hosted on Github](#run-a-script-hosted-on-github)
- [Deploy your own component from scratch](#create-your-own-component)
- [Send an HTTP request to a URL to trigger external code](#send-an-http-request)

In the examples below, you'll use the [Pipedream CLI](https://docs.pipedream.com/cli/reference/) to deploy scheduled jobs. This is the simplest way to interact with Pipedream while you're learning. [Install the Pipedream CLI](https://docs.pipedream.com/cli/install/) before you begin.

You can also deploy components using the [Pipedream UI](https://pipedream.com/sources) or [REST API](https://docs.pipedream.com/api/rest/#create-a-source).

### Run local Node code

Create a local file, `job.js`, that contains the following Node code:

```javascript
console.log("Hello, world");
```

You can run this script on a schedule using `pd deploy`:

```bash
pd deploy --timer --cron "0 0 * * *" --run job.js
```

The argument passed to the `--cron` option — the `"0 0 * * *"` — is a [cron expression](https://crontab.guru/). Cron expressions allow you to specify your job's frequency using a terse, but expressive, syntax. Cron expressions are tied to the UTC timezone.

You can also run a job every N seconds, minutes, or hours using the `--frequency` option:

```bash
pd deploy --timer --frequency 60s --run job.js  # Runs every 60 seconds
pd deploy --timer --frequency 30m --run job.js  # Runs every 30 minutes
pd deploy --timer --frequency 2h --run job.js   # Runs every 2 hours
```

When you run the command above, **Pipedream generates a component from the code in `job.js`**, placing it into the component's [`run` method](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#run). Then, the CLI deploys that component to Pipedream's infrastructure and runs it at the schedule you specified.

You can view the component code in the **Configuration** tab tied to that component in the [Pipedream UI](https://pipedream.com), or by running

```bash
pd describe <component-name> --code
```

If you'd like to save the component code locally, just run:

```bash
pd describe <component-name> --code > component.js
```

### Run a script hosted on Github

You can also deploy any Node.js code hosted on Github:

```bash
pd deploy --timer --cron "0 0 * * *" --run https://github.com/PipedreamHQ/pipedream/blob/master/interfaces/timer/examples/code.js
```

You'll need to copy the URL tied to the file in the Github repo UI, **not** the raw URL tied to the file's contents you get when you press the **Raw** button. That is, pass this:

```text
https://github.com/PipedreamHQ/pipedream/blob/master/interfaces/timer/examples/code.js
```

not this:

```text
https://raw.githubusercontent.com/PipedreamHQ/pipedream/master/interfaces/timer/examples/code.js
```

### Create your own component

[Components](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md) are Node.js modules that export an object with the following properties:

```javascript
module.exports = {
  name: "cronjob", // required
  version: "0.0.1", // required
  props,
  methods,
  run() {
    console.log("Run any Node.js code here");
  },
};
```

The [component API](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md) is deliberately simple. Your component must define a `name`, `version`, a `run` function, and optional `props` that allow the component to accept inputs on deploy.

To run code on a schedule, just include it in your `run` function. Here's a simple `console.log()` statement that runs once an hour:

```javascript
module.exports = {
  name: "cronjob",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *",
      },
    },
  },
  run() {
    console.log("Run any Node.js code here");
  },
};
```

Save this file and deploy it to Pipedream:

```bash
pd deploy job.js
```

Notice the difference between this and the `pd deploy` commands in the examples above. Before, you deployed Node code directly from a local script or Github. That code wasn't wrapped in a component, so you had to specify the `--timer` flag to indicate it should be run on a schedule, and pass the `--run` flag to tell the CLI what code to run. This directed the CLI to generate a component with the correct `timer` prop, a name, version, and put the code you passed to the `--run` flag into the component's `run` method.

**Here, you've written the component yourself, so you can `pd deploy` that directly to Pipedream**.

### Send an HTTP request

If you already have an HTTP endpoint in front of code hosted on another platform, and just need to make an HTTP request to invoke it, use `axios` or another HTTP client library to make the request from your `run` function:

```javascript
module.exports = {
  name: "invoke-http-function",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *",
      },
    },
  },
  async run() {
    const axios = require("axios");

    const resp = await axios({
      method: "GET",
      url: `https://swapi.co/api/films/`,
    });

    console.log(resp.data);
  },
};
```

You can deploy this example component by running:

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/interface/timer/examples/send-http-request.js
```

See our guide on [making HTTP requests with `axios`](https://docs.pipedream.com/workflows/steps/code/nodejs/http-requests/) for more example code.

### Different schedule types

You can schedule code using a [cron expression](https://crontab.guru/) or a frequency in seconds, minutes, or hours. See the examples below for how to specify these schedules using the CLI and via [component props](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#props).

#### Using the CLI

Schedule code using a [cron expression](https://crontab.guru/):

```bash
pd deploy --timer --cron "0 0 * * *" --run job.js
```

All cron schedules are tied to the UTC timezone.

You can also run a job every N seconds, minutes, or hours using the `--frequency` option:

```bash
pd deploy --timer --frequency 60s --run job.js  # Runs every 60 seconds
pd deploy --timer --frequency 30m --run job.js  # Runs every 30 minutes
pd deploy --timer --frequency 2h --run job.js   # Runs every 2 hours
```

#### Using component props

If you're deploying a [component](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md) directly, you can specify a cron schedule directly in [props](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#props) using the `cron` property:

```javascript
module.exports = {
  name: "cronjob",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *",
      },
    },
  },
  run() {
    console.log("Run any Node.js code here");
  },
};
```

All cron schedules are tied to the UTC timezone.

You can also schedule a job to run every N seconds using the `intervalSeconds` property, instead:

```javascript
module.exports = {
  name: "cronjob",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  run() {
    console.log("Run any Node.js code here");
  },
};
```

### Notes and Limitations

**Any cron schedule you specify using the `--cron` option is tied to the UTC timezone**. If you need help converting your schedule to UTC, Google can help. If you'd like to run a job every day at 8:00pm local time, for example, just Google "8:00pm local time to UTC".

Scheduled code can run up to once every 15 seconds. If you need to run a job at this frequency, you'll need to use the `--frequency` scheduling option, since cron expressions cannot exceed frequencies of once per minute:

```bash
pd deploy --timer --frequency 15s --run code.js
```

More generally, components are subject to the [limits of the Pipedream platform](#limits).

## Using the REST API

You can also create a scheduled job using the [REST API](https://docs.pipedream.com/api/rest/).

You can deploy a new component by sending a POST request to the `/sources` endpoint. This accepts two parameters:

- `component_code`: the code for the [Pipedream component](#overview). You'll need to [create your own component](#create-your-own-component), with your code in the [run method](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#run), then include the full component code in this property.
- `name`: the name you'd like to attach to the deployed component

The [`examples/create-component/api-payload.json` file](examples/create-component/api-payload.json) contains a sample payload, with a component that prints a single `console.log` statement once a minute. You can deploy this component using this `cURL` command:

```bash
curl -d @examples/create-component/api-payload.json \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <PIPEDREAM_API_KEY>' \
  https://api.pipedream.com/v1/sources
```

or using the sample Node code in the [`examples/create-component`](examples/create-component) directory:

```javascript
const axios = require("axios");
require("dotenv").config();
const data = require("./api-payload.json");

axios({
  method: "POST",
  url: "https://api.pipedream.com/v1/sources",
  headers: {
    Authorization: `Bearer ${process.env.PIPEDREAM_API_KEY}`,
  },
  data,
})
  .then((res) => console.log(res))
  .catch((err) => console.log(`Error: ${err}`));
```

## Example cron jobs

This repo contains a number of [example components](examples/) that run code on a schedule.

## Logs

Each time your job runs, Pipedream marks its start and end times in the **LOGS** attached to your component in [the UI](https://pipedream.com/sources).

Pipedream refers to logs as "observations" in certain contexts, since they contain a superset of standard output / error, as well as [events emitted by your component](#consuming-event-data-from-your-own-app-outside-pipedream), and start and end markers for each job run.

Any standard output or errors raised by your component are also logged here. You can watch these logs in real time using the `pd logs` CLI command:

```bash
pd logs <component-name>
```

## Consuming event data from your own app, outside Pipedream

Components can **emit** data that you can access from any application. Within your [`run` method](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#run), pass the data you'd like to emit to the `this.$emit` function:

```javascript
this.$emit({
  name: "Luke Skywalker",
});
```

Each time you run `this.$emit()`, you emit the data as an **event**. **Components that emit data are called [event sources](https://docs.pipedream.com/event-sources/).**

Events can be retrieved using the [REST API](https://docs.pipedream.com/api/rest/#get-source-events), [CLI](https://docs.pipedream.com/cli/reference/#pd-events), [or SSE stream tied to your cron job](https://docs.pipedream.com/api/sse/). For example, you can use the CLI to retrieve the last 3 events:

```bash
λ pd events -n 3 <job-name>
{ name: "Luke Skywalker" }
{ name: "Leia Organa" }
{ name: "Han Solo" }
```

This makes it easy to retrieve data processed by your cron job from another app. Typically, you'll want to use the [REST API](https://docs.pipedream.com/api/rest/#get-source-events) to retrieve events in batch, and connect to the [SSE stream](https://docs.pipedream.com/api/sse/) to process them in real time.

## Using npm packages

To use an npm package in a code step, just `require` it:

```javascript
const _ = require("lodash");
```

When you deploy a component, Pipedream downloads these packages and bundles them with your deployment. There's no need to include a `package.json` file with your component.

Some packages — for example, packages like [Puppeteer](https://pptr.dev/), which includes large dependencies like Chromium — may not work on Pipedream. Please [reach out](https://docs.pipedream.com/support/) if you encounter a specific issue.

## Pause a component

You can stop a component from running using `pd update`:

```bash
pd update <component-name> --active false
```

You can activate a component again by running:

```bash
pd update <component-name> --active true
```

## Change a component's schedule

You can update a component's schedule by downloading the component's code and changing its timer props.

For example, let's say you have a component that runs once an hour:

```javascript
module.exports = {
  name: "cronjob",
  version: "0.0.1",
  props: {
    timer: {
      type: "$.interface.timer",
      default: {
        cron: "0 0 * * *",
      },
    },
  },
  run() {
    console.log("Run any Node.js code here");
  },
};
```

Download this code locally:

```bash
pd describe <component-name> --code > component.js
```

and modify the `cron` prop (or `intervalSeconds`, if you specified the job to run at a frequency). For example, if you want to change the job to run once an hour, change `cron` to:

```text
cron: "0 * * * *"
```

Once you update the code, run

```bash
pd update <component-name> --code component.js
```

## Delete a component

You can stop a component from running, deleting all of its events and logs, using `pd delete`:

```bash
pd delete <component-name>
```

## Pricing

Pipedream is currently free (paid tiers are coming soon), subject to the [limits noted below](#limits).

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Limits

Components are subject to the [limits of the Pipedream platform](https://docs.pipedream.com/limits/). Key limits include:

- [30 minutes of component runtime per UTC day](https://docs.pipedream.com/limits/#execution-time-per-day)
- [300 second limit on the execution of a specific run](https://docs.pipedream.com/limits/#time-per-execution)
- [192MB of available memory](https://docs.pipedream.com/limits/#memory) and [512 MB of disk on `/tmp`](https://docs.pipedream.com/limits/#disk) during the execution of your code.

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Getting Support

You can get help [on our public Slack](https://pipedream.com/community) or [reach out to our team directly](https://docs.pipedream.com/support/) with any questions or feedback. We'd love to hear from you!
