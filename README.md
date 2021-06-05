![pipedream](https://i.ibb.co/LPhXtH1/logo.png)

<p align="center">
  <a href="https://pipedream.com/community"><img src="https://img.shields.io/badge/discourse-forum-brightgreen.svg?style=flat-square&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community"></a>
  <a href="https://pipedream.com/support"><img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fsupport&link=https%3A%2F%2Fpipedream.com%2Fsupport)](https://pipedream.com/support"></a>
  <a href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3Dhttps%253A%252F%252Ftwitter.com%252Fpipedream%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=pipedream&tw_p=followbutton"><img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social"></a>
</p>

Pipedream is a serverless integration and compute platform.

We provide a free, hosted platform that makes it easy to connect apps and develop, execute and maintain event-driven workflows. The platform has over 300 fully integrated applications with managed authentication and support for over 1M npm packages.

**Key Features**:

- [Event Sources](#event-sources) - Open source [components](https://github.com/PipedreamHQ/pipedream/tree/master/components) that emit events from services (GitHub, Slack, Airtable, RSS & [more](https://pipedream.com/apps)).
- [Workflows](#workflows) - A sequence of linear steps - just Node.js code - triggered by an event (via event source, HTTP or timer)
- [Actions](#actions) - Prebuilt code steps that you can use in a workflow to perform common operations across Pipedream's 300+ API integrations, for example: sending email, adding a row to a Google Sheet, and [more](https://pipedream.com/apps).
- [Destinations](#destinations) - Deliver events asynchronously to common destinations like Amazon S3, Snowflake, HTTP and email
- Serverless - No server or cloud resources to manage
- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

**Product Demo**: [YouTube](https://www.youtube.com/watch?v=hJ-KRbp6EO8&feature=youtu.be) (5 minutes)

You can also [get support](#getting-support), [raise a bug or feature request](#found-a-bug-have-a-feature-to-suggest), or [file a security disclosure](#security-disclosures).

## Event Sources

Pipedream receives data via event sources. Event sources are open source, run on Pipedream's infrastructure and collect data from your own application and/or services like GitHub, DropBox, Zoom, RSS feeds, and more.

Event sources emit new events produced by the service, which can trigger Pipedream workflows, or which you can consume using [Pipedream's REST API](https://docs.pipedream.com/api/rest/) or a private, real-time [SSE stream](https://docs.pipedream.com/api/sse/).

Here is the simplest event source possible, an HTTP event source:

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

You can also create your own event sources for your own personal use. If you think others would benefit from your source, you can publish them to all Pipedream users by opening a PR in this repo. See these docs to get started:

- [Component API](COMPONENT-API.md)
- [HTTP Event Sources Quickstart](https://github.com/PipedreamHQ/pipedream/tree/master/interfaces/http)
- [Timer-based Event Sources Quickstart](https://github.com/PipedreamHQ/pipedream/tree/master/interfaces/timer)

## Workflows

Workflows are a sequence of linear [steps](https://docs.pipedream.com/workflows/steps) - just Node.js code - triggered by an event (via event source, HTTP endpoint, or timer). Workflows make it easy to transform data and integrate with 300+ APIs from various apps and services.

- Trigger your workflow on any event (e.g. [HTTP requests](https://docs.pipedream.com/workflows/steps/triggers/#http) or a [schedule](https://docs.pipedream.com/workflows/steps/triggers/#cron-scheduler)).
- Add steps to run [Node.js code](https://docs.pipedream.com/workflows/steps/code/) (using virtually any npm package) and [prebuilt actions](https://docs.pipedream.com/workflows/steps/actions/).
- Steps are executed in the order they appear in your workflow.
- Data is shared between steps via [step exports](https://docs.pipedream.com/workflows/steps/#step-exports).

Workflow code is [public by default](https://docs.pipedream.com/public-workflows/) so the community can discover and [copy them](https://docs.pipedream.com/workflows/copy/). Your workflow execution and event data is private.

You can copy [this example workflow](https://pipedream.com/@tod/use-http-requests-to-trigger-a-workflow-p_6lCy5y/readme) to get started, or review some [community-developed workflows](https://pipedream.com/explore) to see what others are building.

As you build more advanced workflows, you may also find these docs helpful:

- [What are events?](https://docs.pipedream.com/workflows/events/) - events trigger workflow executions
- [What are steps?](https://docs.pipedream.com/workflows/steps/) - building blocks you use to create workflows
- [Managing workflow state](https://docs.pipedream.com/workflows/steps/code/state/) - how to store state in one execution of a workflow that you can read in subsequent executions
- [Passing data to steps](https://docs.pipedream.com/workflows/steps/#passing-data-to-steps-step-parameters) - steps are just Node functions, and can accept input via step parameters.
- [Connected Accounts](https://docs.pipedream.com/connected-accounts/) - how to authenticate to APIs within code steps.
- [Error Handling](https://docs.pipedream.com/workflows/error-handling/global-error-workflow/#modifying-the-global-error-workflow) - how to use the Global Error workflow to manage errors raised by workflows.

## Actions

[Actions](https://docs.pipedream.com/workflows/steps/actions/) are prebuilt code steps that you can use to perform common operations across Pipedream's 300+ API integrations, for example: sending email, adding a row to a Google Sheet, and more. Pipedream currently supports over 1000+ actions.

Typically, integrating with these services requires a custom code to manage authentication, error handling, etc. Actions abstract that for you - you just pass the necessary params as input and the action handles the rest. For example, the **Send HTTP Request** action accepts the data you want to send and the URL you want to send it to, returning the HTTP response for use in future steps.

Actions come prebuilt to solve a common use case, but you can modify them in any way you'd like. Actions are just Node.js functions. When you add an action, you'll see its code in your workflow - just click into the code and start editing to modify it.

Finally, you can [create your own actions](https://docs.pipedream.com/workflows/steps/actions/#creating-your-own-actions), allowing you to re-use them across workflows in your account. You can even [publish actions](https://docs.pipedream.com/workflows/steps/actions/#save-vs-publish) to the entire Pipedream community, making them available for anyone to use.

Here's the code for the **Send HTTP Request** action:

```javascript
async (params) => {
  const config = {
    method: params.method || "post",
    url: params.url,
  };
  for (const { key, value } of params.query || []) {
    if (!config.params) config.params = {};
    config.params[key] = value;
  }
  for (const { key, value } of params.headers || []) {
    if (!config.headers) config.headers = {};
    config.headers[key] = value;
  }
  if (params.auth) {
    config.auth = {
      username: params.auth.username,
      password: params.auth.password,
    };
  }
  if (params.responseType) {
    config.responseType = params.responseType;
  }
  if (params.payload) config.data = params.payload;
  return await require("@pipedreamhq/platform").axios(this, config);
};
```

## Destinations

[Destinations](https://docs.pipedream.com/destinations/), like Actions, abstract the connection, batching, and delivery logic required to send events to services like Amazon S3 and Snowflake, or targets like HTTP and email.

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
- [Pipedream SQL Service](https://docs.pipedream.com/destinations/sql/)
- [SSE](https://docs.pipedream.com/destinations/sse/)

## Pricing

Pipedream has a [generous free tier](https://docs.pipedream.com/pricing/#developer-tier). You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](https://docs.pipedream.com/pricing/#professional-tier).

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Limits

The Pipedream platform imposes some runtime limits on sources and workflows. [Read more about those in our docs](https://docs.pipedream.com/limits/).

## Getting Support

You can get help [on our Discourse and public Slack](https://pipedream.com/support), and share any feedback with our team. We'd love to hear from you!

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://docs.pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or comment on your specific use case.

If an issue _doesn't_ yet exist, please use these templates to create one:

**[New feature](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=)**

**[Report a bug](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=bug&template=bug_report.md&title=)**

**[New trigger / source](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=enhancement%2C+trigger&template=trigger-request.md&title=%5BTRIGGER%5D)**

**[New API integration](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=app&template=app---service-integration.md&title=%5BAPP%5D)**

**[New action](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=action%2C+enhancement&template=action-request.md&title=%5BACTION%5D)**

## Security disclosures

If you'd like to report a suspected vulnerability or security issue, or have any questions about the security of the product, please contact our security team at **security@pipedream.com**.
