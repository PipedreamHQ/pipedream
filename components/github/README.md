# Github API Integration Platform

### Connect Github + 1000s of apps, remarkably fast.

---

Pipedream is an integration platform for developers. Pipedream provides a free, hosted platform for connecting apps and developing event-driven automations.

<a href="https://bit.ly/3M2Yclb"><img src="https://i.ibb.co/n38r3KV/github.png" alt="github" border="0" height="50" /></a>

## Demo

Click the image below to watch a brief demo on YouTube.

<p align="left">
  <br />
  <a href="https://bit.ly/36fwHWs">
    <img src="https://github.com/PipedreamHQ/pipedream/blob/master/images/demo.png" width="500px" alt="Pipedream demo static image" />
  </a>
</p>

## Key Features

- [Workflows](#workflows) - Workflows run automations. Workflows are sequence of steps - pre-built actions or custom [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code - triggered by an event (HTTP request, timer, new row added to a Google Sheet, and more).

- [Event Sources](#event-sources) - Sources trigger workflows. They emit events from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When you want to run a workflow when an event happens in any third-party app, you're using an event source.

- [Actions](#actions) - Actions are pre-built code steps that you can use in a workflow to perform common operations across Pipedream's 500+ API integrations. For example, you can use actions to send email, add a row to a Google Sheet, [and more](https://pipedream.com/apps).

- [Custom code](#code) - Most integrations require custom logic. Code is often the best way to express that logic, so Pipedream allows you to run any [Node.js](https://pipedream.com/docs/code/nodejs/), [Python](https://pipedream.com/docs/code/python/), [Golang](https://pipedream.com/docs/code/go/), or [Bash](https://pipedream.com/docs/code/bash/) code. You can import any package from the languages' package managers, connect to any Pipedream connected app, and more. Pipedream is "low-code" in the best way: you can use pre-built components when you're performing common actions, but you can write custom code when you need to.

- [Destinations](#destinations) - Deliver events asynchronously to common destinations like Amazon S3, Snowflake, HTTP and email

- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

## Workflows

Workflows are a sequence of linear [steps](https://pipedream.com/docs/workflows/steps) triggered by an event (like an HTTP request, or when a new row is added to a Google sheet). You can quickly develop complex automations using workflows and connect to any of our 500+ integrated apps.

[See our workflow quickstart](https://pipedream.com/docs/quickstart/) to get started.

<p align="left">
  <br />
  <img src="https://github.com/PipedreamHQ/pipedream/blob/master/images/github6.png" width="800px" alt="HTTP trigger + step selection menu" >
  <br />
</p>

## Github API Event Sources ([explore](https://pipedream.com/apps/github))

[Event Sources](https://pipedream.com/docs/sources/) watch for new data from services like GitHub, Slack, Airtable, RSS and [more](https://pipedream.com/apps). When a source finds a new event, it emits it, triggering any linked workflows.

- [Custom Events](https://pipedream.com/new?h=eyJuIjoiQ3VzdG9tIFdlYmhvb2sgRXZlbnRzIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbInNjX3Y0aXh4Sm4iXSwicyI6W10sImMiOnt9fQ) - Build your own event source using one or multiple events ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/custom-events.js))
- [New Branch](https://pipedream.com/new?h=eyJuIjoiTmV3IEJyYW5jaCAoSW5zdGFudCkgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfRWdpcnJxeSJdLCJzIjpbXSwiYyI6e319) - Triggered when a new branch is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-branch.js))
- [New Commit](https://pipedream.com/new?h=eyJuIjoiTmV3IENvbW1pdCB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY19BM2lwUkJZIl0sInMiOltdLCJjIjp7fX0) - Triggered when a new commit comment is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-commit.js))
- [New Commit Comment](https://pipedream.com/new?h=eyJuIjoiTmV3IENvbW1pdCBDb21tZW50IChJbnN0YW50KSB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY19RMmlCQnBZIl0sInMiOltdLCJjIjp7fX0) - Triggered when a new comment on a commit is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-commit-comment.js))
- [New Issue](https://pipedream.com/new?h=eyJuIjoiTmV3IElzc3VlIChJbnN0YW50KSB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY19uNWkwMFlrIl0sInMiOltdLCJjIjp7fX0) - Triggered when a new issue is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-issue.js))
- [New Label](https://pipedream.com/new?h=eyJuIjoiTmV3IExhYmVsIChJbnN0YW50KSB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY185OWl2djU0Il0sInMiOltdLCJjIjp7fX0) - Triggered when a new label is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-label.js))
- [New Mention](https://pipedream.com/new?h=eyJuIjoiTmV3IE1lbnRpb24gd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2NfTWVpYU5EIl0sInMiOltdLCJjIjp7fX0b) - Triggers when your username is mentioned in a Commit, Comment, Issue or Pull Request. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-mention.js))
- [New Milestone](https://pipedream.com/new?h=eyJuIjoiTmV3IE1pbGVzdG9uZSAoSW5zdGFudCkgd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOlsic2Nfb2dpOTlEbyJdLCJzIjpbXSwiYyI6e319) - Triggered when a new milestone is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-milestone.js))
- [New Pull Request](https://pipedream.com/new?h=eyJuIjoiTmV3IG9yIFVwZGF0ZWQgUHVsbCBSZXF1ZXN0IChJbnN0YW50KSB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6WyJzY19WUmlnZzMzIl0sInMiOltdLCJjIjp7fX0) - Triggered when a new pull request is created. ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/new-pull-request.js))

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

## Github API Actions ([explore](https://pipedream.com/apps/github))

[Actions](https://pipedream.com/docs/components/actions/) are pre-built code steps that you can use in a workflow to perform common operations across Pipedream's 500+ API integrations. For example, you can use actions to send email, add a row to a Google Sheet, [and more](https://pipedream.com/apps).

- [Create Issue](https://pipedream.com/new?h=eyJuIjoiQ3JlYXRlIElzc3VlIHdpdGggdGhlIEdpdEh1YiBBUEkiLCJ2IjoyLCJ0IjpbXSwicyI6W3sia2V5IjoiZ2l0aHViLWNyZWF0ZS1pc3N1ZSJ9XSwiYyI6e319) - Triggers when your username is mentioned in a Commit, Comment, Issue or Pull Request. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github/actions/create-issue))
- [Get Repository](https://pipedream.com/new?h=eyJuIjoiR2V0IFJlcG8gd2l0aCB0aGUgR2l0SHViIEFQSSIsInYiOjIsInQiOltdLCJzIjpbeyJrZXkiOiJnaXRodWItZ2V0LXJlcG8ifV0sImMiOnt9fQ) - Triggered when a new milestone is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github/actions/get-repo))
- [Search Issues](https://pipedream.com/new?h=eyJuIjoiU2VhcmNoIElzc3VlcyBhbmQgUHVsbCBSZXF1ZXN0cyB3aXRoIHRoZSBHaXRIdWIgQVBJIiwidiI6MiwidCI6W10sInMiOlt7ImtleSI6ImdpdGh1Yi1zZWFyY2gtaXNzdWVzLWFuZC1wdWxsLXJlcXVlc3RzIn1dLCJjIjp7fX0) - Triggered when a new pull request is created. ([code](https://github.com/PipedreamHQ/pipedream/tree/master/components/github/actions/search-issues-and-pull-requests))

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
    }
  },
  async run() {
    return `hello ${this.name}!`
  },
}
```

You can find the code for all pre-built actions in [the `components` directory](https://github.com/PipedreamHQ/pipedream/tree/master/components). If you find a bug or want to contribute a feature, [see our contribution guide](https://pipedream.com/docs/components/guidelines/#process).

## Other Popular API Integrations

- [Airtable](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) ([explore](https://pipedream.com/apps/airtable))
- [AWS](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws) ([explore](https://pipedream.com/apps/aws))
- [Dropbox](https://github.com/PipedreamHQ/pipedream/tree/master/components/dropbox) ([explore](https://pipedream.com/apps/dropbox))
- [Google Sheets](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-sheets) ([explore](https://pipedream.com/apps/google-sheets))
- [Google Drive](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-drive) ([explore](https://pipedream.com/apps/google-drive))
- [RSS](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) ([explore](https://pipedream.com/apps/rss))
- [Twitter](https://github.com/PipedreamHQ/pipedream/tree/master/components/twitter) ([explore](https://pipedream.com/apps/twitter))

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
import axios from 'axios'
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
import { WebClient } from '@slack/web-api'

export default defineComponent({
  props: {
    // This creates a connection called "slack" that connects a Slack account.
    slack: {
      type: 'app',
      app: 'slack'
    }
  },
  async run({ steps, $ }) {
    const web = new WebClient(this.slack.$auth.oauth_access_token)

    return await web.chat.postMessage({
      text: "Hello, world!",
      channel: "#general",
    })
  }
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

## Troubleshooting

Note: Event Source [New Card in Column](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-card-in-column/new-card-in-column.mjs) only supports legacy (classic) projects.

Please [reach out](https://pipedream.com/support/) to the Pipedream team with any technical issues or questions about the Github integration. We're happy to help!
