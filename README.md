![pipedream](https://i.ibb.co/LPhXtH1/logo.png)

<p align="center">.
  <a href="https://pipedream.com/community"><img src="https://img.shields.io/badge/discourse-forum-brightgreen.svg?style=flat-square&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community"></a>
  <a href="https://pipedream.com/support"><img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fsupport&link=https%3A%2F%2Fpipedream.com%2Fsupport)](https://pipedream.com/support"></a>
  <a href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3Dhttps%253A%252F%252Ftwitter.com%252Fpipedream%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=pipedream&tw_p=followbutton"><img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social"></a>
  <a href="https://wellfound.com/company/pipedreamhq/jobs"><img src="https://img.shields.io/badge/%F0%9F%91%8B%F0%9F%8F%BC%20We're%20hiring!-Join%20us-brightgreen"></a>
</p>

Pipedream is an integration platform for developers.

Pipedream provides a free, hosted platform for connecting apps and developing event-driven automations. The platform has over 1,000 fully-integrated applications, so you can use pre-built components to quickly send messages to Slack, add a new row to Google Sheets, and more. You can also run any Node.js, Python, Golang, or Bash code when you need custom logic. Pipedream has demonstrated SOC 2 compliance and can provide a SOC 2 Type 2 report upon request (please email support@pipedream.com).

<p align="center">
  <br />
  <img src="./images/hero2.png" width="800px" alt="HTTP trigger + step selection menu" >
  <br />
</p>

This repo contains:

- [The code for all pre-built integration components](https://github.com/PipedreamHQ/pipedream/tree/master/components)
- [The product roadmap](https://github.com/PipedreamHQ/pipedream/issues)
- [The Pipedream docs](https://github.com/PipedreamHQ/pipedream/tree/master/docs)
- And other source code related to Pipedream.

This `README` explains the key features of the platform and how to get started.

To get support, please visit [https://pipedream.com/support](https://pipedream.com/support).

## Key Features

- [Workflows](#workflows) - Workflows run automations. Workflows are sequences of steps - pre-built actions or custom [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code - triggered by an event (HTTP request, timer, when a new row is added to a Google Sheets, and more).
- [Event Sources](#event-sources) - Sources trigger workflows. They emit events from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When you want to run a workflow when an event happens in any third-party app, you're using an event source.
- [Actions](#actions) - Actions are pre-built code steps that you can use in a workflow to perform common operations across Pipedream's 1,000+ API integrations. For example, you can use actions to send email, add a row to a Google Sheet, [and more](https://pipedream.com/apps).
- [Custom code](#code) - Most integrations require custom logic. Code is often the best way to express that logic, so Pipedream allows you to run any [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code. You can import any package from the languages' package managers, connect to any Pipedream connected app, and more. Pipedream is "low-code" in the best way: you can use pre-built components when you're performing common actions, but you can write custom code when you need to.
- [Destinations](#destinations) - Deliver events asynchronously to common destinations like Amazon S3, Snowflake, HTTP and email.
- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

## Demo

Click the image below to watch a brief demo on YouTube.

<p align="center">
  <br />
  <a href="https://bit.ly/36fwHWs">
    <img src="./images/demo.png" width="800px" alt="Pipedream demo static image" />
  </a>
</p>

### Workflows

Workflows are sequences of linear [steps](https://pipedream.com/docs/workflows/steps) triggered by an event (like an HTTP request, or when a new row is added to a Google sheet). You can quickly develop complex automations using workflows and connect to any of our 1,000+ integrated apps.

[See our workflow quickstart](https://pipedream.com/docs/quickstart/) to get started.

### Event Sources

[Event Sources](https://pipedream.com/docs/sources/) watch for new data from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When a source finds a new event, it emits it, triggering any linked workflows.

You can also consume events emitted by sources using [Pipedream's REST API](https://pipedream.com/docs/api/rest/) or a private, real-time [SSE stream](https://pipedream.com/docs/api/sse/).

When a pre-built source doesn't exist for your use case, [you can build your own](https://pipedream.com/docs/components/quickstart/nodejs/sources/). Here is the simplest event source: it exposes an HTTP endpoint you can send any request to, and prints the contents of the request when invoked:

```javascript
export default {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
  },
  run(event) {
    console.log(event); // event contains the method, payload, etc.
  },
};
```

<a href="https://pipedream.com/sources/new?app=http"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>

You can find the code for all pre-built sources in [the `components` directory](https://github.com/PipedreamHQ/pipedream/tree/master/components). If you find a bug or want to contribute a feature, [see our contribution guide](https://pipedream.com/docs/components/guidelines/#process).

### Actions

[Actions](https://pipedream.com/docs/components/actions/) are pre-built code steps that you can use in a workflow to perform common operations across Pipedream's 500+ API integrations. For example, you can use actions to send email, add a row to a Google Sheet, [and more](https://pipedream.com/apps).

You can [create your own actions](https://pipedream.com/docs/components/quickstart/nodejs/actions/), which you can re-use across workflows. You can also [publish actions to the entire Pipedream community](https://pipedream.com/docs/components/guidelines/), making them available for anyone to use.

Here's an action that accepts a `name` as input and prints it to the workflow's logs:

```javascript
export default {
  name: "Action Demo",
  description: "This is a demo action",
  key: "action_demo",
  version: "0.0.1",
  type: "action",
  props: {
    name: {
      type: "string",
      label: "Name",
    },
  },
  async run() {
    return `hello ${this.name}!`;
  },
};
```

You can find the code for all pre-built actions in [the `components` directory](https://github.com/PipedreamHQ/pipedream/tree/master/components). If you find a bug or want to contribute a feature, [see our contribution guide](https://pipedream.com/docs/components/guidelines/#process).

### Custom code

Most integrations require custom logic. Code is often the best way to express that logic, so Pipedream allows you to run custom code in a workflow using:

<table align="center">
  <tr>
    <td>
      <a href="https://pipedream.com/docs/code/nodejs/">
        <img alt="Node.js" src="https://res.cloudinary.com/pipedreamin/image/upload/v1646761316/docs/icons/icons8-nodejs_aax6wn.svg" width="100">
      </a>
    </td>
    <td>
      <a href="https://pipedream.com/docs/code/python/">
        <img alt="Python" src="https://res.cloudinary.com/pipedreamin/image/upload/v1647356607/docs/icons/python-logo-generic_k3o5w2.svg" width="100">
      </a>
    </td>
  </tr>
  </tr>
    <td>
      <a href="https://pipedream.com/docs/code/go/">
        <img alt="Go" src="https://res.cloudinary.com/pipedreamin/image/upload/v1646763751/docs/icons/Go-Logo_Blue_zhkchv.svg" width="100">
      </a>
    </td>
    <td>
      <a href="https://pipedream.com/docs/code/bash/">
        <img alt="Bash" src="https://res.cloudinary.com/pipedreamin/image/upload/v1647356698/docs/icons/full_colored_dark_1_-svg_vyfnv7.svg" width="100">
      </a>
    </td>
  </tr>
</table>

You can import any package from the languages' package managers by declaring the imports directly in code. Pipedream will parse and download the necessary dependencies.

```javascript
// Node.js
import axios from "axios";
```

```python
# Python
import pandas as pd
```

```golang
// Go
import (
    "fmt"
    pd "github.com/PipedreamHQ/pipedream-go"
)
```

You can also [connect to any Pipedream connected app in custom code steps](https://pipedream.com/docs/code/nodejs/auth/). For example, you can connect your Slack account and send a message to a channel:

```javascript
import { WebClient } from "@slack/web-api";

export default defineComponent({
  props: {
    // This creates a connection called "slack" that connects a Slack account.
    slack: {
      type: "app",
      app: "slack",
    },
  },
  async run({ steps, $ }) {
    const web = new WebClient(this.slack.$auth.oauth_access_token);

    return await web.chat.postMessage({
      text: "Hello, world!",
      channel: "#general",
    });
  },
});
```

### Destinations

[Destinations](https://pipedream.com/docs/destinations/), like actions, abstract the connection, batching, and delivery logic required to send events to services like Amazon S3, or targets like HTTP and email.

For example, sending data to an Amazon S3 bucket is as simple as calling `$send.s3()`:

```javascript
$send.s3({
  bucket: "your-bucket-here",
  prefix: "your-prefix/",
  payload: event.body,
});
```

Pipedream supports the following destinations:

- [Amazon S3](https://docs.pipedream.com/destinations/s3/)
- [Snowflake](https://docs.pipedream.com/destinations/snowflake/)
- [HTTP](https://docs.pipedream.com/destinations/http/)
- [Email](https://docs.pipedream.com/destinations/email/)
- [SSE](https://docs.pipedream.com/destinations/sse/)

## Contributors

Thank you to everyone who has contributed to the Pipedream codebase. We appreciate you!

<a href="https://github.com/PipedreamHQ/pipedream/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=PipedreamHQ/pipedream" />
</a>

## Pricing

Pipedream has a [generous free tier](https://pipedream.com/docs/pricing/#developer-tier). You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](https://pipedream.com/docs/pricing/).

## Limits

The Pipedream platform imposes some runtime limits on sources and workflows. [Read more about those in our docs](https://pipedream.com/docs/limits/).

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or add a comment detailing your specific use case.

If an issue _doesn't_ yet exist and you need to create one, please [use the issue templates](https://github.com/PipedreamHQ/pipedream/issues/new/choose).

## Security

You can read about our platform security and privacy [here](https://pipedream.com/docs/privacy-and-security/).

If you'd like to report a suspected vulnerability or security issue, or have any questions about the security of the product, please contact our security team at **security@pipedream.com**.
