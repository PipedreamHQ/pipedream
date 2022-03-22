![pipedream](https://i.ibb.co/LPhXtH1/logo.png)

<p align="center">
  <a href="https://pipedream.com/community"><img src="https://img.shields.io/badge/discourse-forum-brightgreen.svg?style=flat-square&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community"></a>
  <a href="https://pipedream.com/support"><img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fsupport&link=https%3A%2F%2Fpipedream.com%2Fsupport)](https://pipedream.com/support"></a>
  <a href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3Dhttps%253A%252F%252Ftwitter.com%252Fpipedream%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=pipedream&tw_p=followbutton"><img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social"></a>
  <a href="https://angel.co/company/pipedreamhq/jobs/"><img src="https://img.shields.io/badge/%F0%9F%91%8B%F0%9F%8F%BC%20We're%20hiring!-Join%20us-brightgreen"></a>
</p>

Pipedream is an integration platform for developers.

We provide a free, hosted platform that makes it easy to connect apps and develop, execute and maintain event-driven workflows. The platform has over 500 fully integrated applications with managed authentication and support for over 1M npm packages.

**DEMO**: [YouTube](https://www.youtube.com/watch?v=BGKuPYMNKGg)

**Key Features**:

- [Event Sources](#event-sources) - Open source [components](https://github.com/PipedreamHQ/pipedream/tree/master/components) that emit events from services (GitHub, Slack, Airtable, RSS & [more](https://pipedream.com/apps)).
- [Workflows](#workflows) - A sequence of linear steps - just Node.js code - triggered by an event (via event source, HTTP, timer, and more)
- [Actions](#actions) - Prebuilt code steps that you can use in a workflow to perform common operations across Pipedream's 400+ API integrations, for example: sending email, adding a row to a Google Sheet, [and more](https://pipedream.com/apps).
- [Destinations](#destinations) - Deliver events asynchronously to common destinations like Amazon S3, Snowflake, HTTP and email
- Serverless - No server or cloud resources to manage
- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

You can also [get support](https://pipedream.com/support), [raise a bug or feature request](#found-a-bug-have-a-feature-to-suggest), or [file a security disclosure](#security-disclosures).

## Workflows

Workflows are a sequence of linear [steps](https://docs.pipedream.com/workflows/steps) - just Node.js code - triggered by an event (via [event source](https://pipedream.com/docs/event-sources/), HTTP endpoint, timer, and more). Workflows make it easy to transform data and integrate with 300+ APIs from various apps and services.

- Trigger your workflow on any event (e.g. [HTTP requests](https://docs.pipedream.com/workflows/steps/triggers/#http), [on a schedule](https://docs.pipedream.com/workflows/steps/triggers/#cron-scheduler), [and more](https://pipedream.com/docs/workflows/steps/triggers/)).
- Add steps to run [Node.js code](https://docs.pipedream.com/workflows/steps/code/) (using virtually any npm package) and [prebuilt actions](https://docs.pipedream.com/workflows/steps/actions/).
- Steps are executed in the order they appear in your workflow.
- Data is shared between steps via [step exports](https://docs.pipedream.com/workflows/steps/#step-exports).

[See our workflow quickstart](https://pipedream.com/docs/quickstart/) for a detailed walkthrough of building a workflow end-to-end.

As you build more advanced workflows, you may also find these docs helpful:

- [What are events?](https://docs.pipedream.com/workflows/events/) - events trigger workflow executions
- [What are steps?](https://docs.pipedream.com/workflows/steps/) - building blocks you use to create workflows
- [Managing workflow state](https://docs.pipedream.com/workflows/steps/code/state/) - how to store state in one execution of a workflow that you can read in subsequent executions
- [Passing data to steps](https://docs.pipedream.com/workflows/steps/#passing-data-to-steps-step-parameters) - steps are just Node functions, and can accept input via step parameters.
- [Connected Accounts](https://docs.pipedream.com/connected-accounts/) - how to authenticate to APIs within code steps.
- [Error Handling](https://docs.pipedream.com/workflows/error-handling/global-error-workflow/#modifying-the-global-error-workflow) - how to use the Global Error workflow to manage errors raised by workflows.

## Event Sources

Pipedream receives data via event sources. Event sources are open source, run on Pipedream's infrastructure and collect data from your own application and/or services like GitHub, Dropbox, Zoom, RSS feeds, and more.

Event sources emit new events produced by the service, which can trigger Pipedream workflows, or which you can consume using [Pipedream's REST API](https://docs.pipedream.com/api/rest/) or a private, real-time [SSE stream](https://docs.pipedream.com/api/sse/).

Here is the simplest event source, an HTTP source:

```javascript
module.exports = {
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

Popular Event Sources:

- [Airtable](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) ([deploy](https://pipedream.com/sources/new?app=airtable))
- [AWS](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws) ([deploy](https://pipedream.com/sources/new?app=aws))
- [Dropbox](https://github.com/PipedreamHQ/pipedream/tree/master/components/dropbox) ([deploy](https://pipedream.com/sources/new?app=dropbox))
- [GitHub](https://github.com/PipedreamHQ/pipedream/blob/master/components/github/readme.md) ([deploy](https://pipedream.com/sources/new?app=github))
- [Google Calendar](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-calendar) ([deploy](https://pipedream.com/sources/new?app=google-calendar))
- [Google Drive](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-drive) ([deploy](https://pipedream.com/sources/new?app=google-drive))
- [RSS](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) ([deploy](https://pipedream.com/sources/new?app=rss))
- [Twitter](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/readme.md) ([deploy](https://pipedream.com/sources/new?app=twitter))

Event sources can also be deployed via the [Pipedream CLI](https://docs.pipedream.com/cli/reference/). Once installed, you can deploy an event source by running:

```bash
pd deploy   # prompts you to select a component and pass required options
```

You can create your own event sources for your own personal use. If you think others would benefit from your source, you can [publish them to all Pipedream users](https://pipedream.com/docs/components/guidelines/). See these docs to get started:

- [Quickstart for developing a source](https://pipedream.com/docs/components/quickstart/nodejs/sources/)
- [Component API](https://pipedream.com/docs/components/api/)

## Actions

[Actions](https://pipedream.com/docs/components/#actions) are prebuilt code steps that you can use to perform common operations across Pipedream's 400+ API integrations, for example: sending email, adding a row to a Google Sheet, and more. Pipedream supports thousands of prebuilt actions.

Typically, integrating with these services requires a custom code to manage authentication, error handling, etc. Actions abstract that for you: you just pass the necessary params as input, and the action handles the rest. For example, the HTTP **GET Request** action accepts the data you want to send and the URL you want to send it to, returning the HTTP response for use in future steps.

You can [create your own actions](https://pipedream.com/docs/components/quickstart/nodejs/actions/), allowing you to re-use them across workflows in your account. You can also [publish actions to the entire Pipedream community](https://pipedream.com/docs/components/guidelines/), making them available for anyone to use.

Here's the code for an action to make an HTTP GET request:

```javascript
const axios = require('axios')
const http = require('../../http.app.js')

module.exports = {  
  key: "http-get-request",
  name: "GET Request",
  description: "Make an HTTP `GET` request to any URL. Optionally configure query string parameters, headers and basic auth.",
  type: "action",
  version: "0.0.1",
  props: {
    http,
    url: { propDefinition: [http, "url"] },
    params: { propDefinition: [http, "params"] },
    headers: { propDefinition: [http, "headers"] },
    auth: { propDefinition: [http, "auth"] },
  },
  methods: {},
  async run() {
    const config = {
      url: this.url,
      method: "GET",
      params: this.params,
      headers: this.headers,
    }
    if (this.auth) config.auth = this.http.parseAuth(this.auth)
    return (await axios(config)).data
  },
}
```

## Destinations

[Destinations](https://docs.pipedream.com/destinations/), like actions, abstract the connection, batching, and delivery logic required to send events to services like Amazon S3, or targets like HTTP and email.

For example, sending data to an Amazon S3 bucket is as simple as calling `$send.s3()`:

```javascript
$send.s3({
  bucket: "your-bucket-here",
  prefix: "your-prefix/",
  payload: event.body,
});
```

Pipedream supports the following destinations today:

- [Amazon S3](https://docs.pipedream.com/destinations/s3/)
- [Snowflake](https://docs.pipedream.com/destinations/snowflake/)
- [HTTP](https://docs.pipedream.com/destinations/http/)
- [Email](https://docs.pipedream.com/destinations/email/)
- [SSE](https://docs.pipedream.com/destinations/sse/)

## Pricing

Pipedream has a [generous free tier](https://docs.pipedream.com/pricing/#developer-tier). You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](https://docs.pipedream.com/pricing/).

## Limits

The Pipedream platform imposes some runtime limits on sources and workflows. [Read more about those in our docs](https://docs.pipedream.com/limits/).

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://docs.pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or comment on your specific use case.

If an issue _doesn't_ yet exist, please use these templates to create one:

**[New feature](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D+)**

**[Report a bug](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+)**

**[New trigger / source](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=enhancement%2C+good+first+issue%2C+help+wanted%2C+trigger+%2F+source&template=new-trigger---event-source.md&title=%5BTRIGGER%5D)**

**[New API integration](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=app%2C+enhancement&template=app---service-integration.md&title=%5BAPP%5D)**

**[New action](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=action%2C+enhancement%2C+good+first+issue%2C+help+wanted&template=action-request.md&title=%5BACTION%5D)**

## Security

You can read about our platform security and privacy [here](https://pipedream.com/docs/privacy-and-security/).

If you'd like to report a suspected vulnerability or security issue, or have any questions about the security of the product, please contact our security team at **security@pipedream.com**.
