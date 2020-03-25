![pipedream](https://i.ibb.co/hB42XLK/github2.png)

<p align="center">
  <img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community">
  <img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social">
</p>

Pipedream is a platform for running hosted, backend components.

**Pipedream components are reusable Node.js modules that run code on specific events**: HTTP requests, timers, and more. Components are [free to run](#pricing) and [simple to learn](COMPONENT-API.md). Here's a component that spins up a hosted HTTP server on deploy and logs inbound HTTP requests:

```javascript
module.exports = {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http"
  },
  run(event) {
    console.log(event); // event contains the method, payload, etc.
  }
};
```

Components come with a [built-in key-value store](COMPONENT-API.md#servicedb), an interface for passing input via [props](COMPONENT-API.md#props), and more. You deploy and manage components using Pipedream's [REST API](https://docs.pipedream.com/api/rest/) or [CLI](https://docs.pipedream.com/cli/reference/).

[Components can emit events](COMPONENT-API.md#thisemit), which can be retrieved programmatically via [CLI](https://docs.pipedream.com/cli/reference/), [API](https://docs.pipedream.com/api/rest/) or [SSE](https://docs.pipedream.com/api/sse/). Components that emit events can be used as **event sources**. Event Sources collect data from any service and make it available via Pipedream's REST or SSE APIs: **they can turn any API into an event stream, or turn any event stream into an API**. For example, you can use event sources to create a REST API from an RSS feed. You can also trigger [Pipedream workflows](https://docs.pipedream.com/workflows/) on these events.

## Usage

Install the Pipedream CLI:

```bash
curl https://cli.pipedream.com/install | sh
```

Then deploy a component from the registry:

```bash
pd deploy   # prompts you to select a component and pass required options
```

The simplest event source is an [HTTP Source](components/http#quickstart). Start there or review [the docs](#docs) to learn more.

## Docs

- [Component API](COMPONENT-API.md)
- [Event Sources](https://docs.pipedream.com/event-sources/)
- [HTTP Event Sources Quickstart](https://github.com/PipedreamHQ/pipedream/tree/master/components/http)
- [REST API Reference](https://docs.pipedream.com/api/rest/)
- [SSE Reference](https://docs.pipedream.com/api/sse/)
- [CLI Reference](https://docs.pipedream.com/cli/reference/)
- [Workflows](https://docs.pipedream.com/workflows/)

## Pricing

Pipedream is currently free, subject to the [limits noted below](#limits). Paid tiers for higher volumes are coming soon.

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Limits

Components are subject to the [limits of the Pipedream platform](https://docs.pipedream.com/limits/) in all cases but one: workflows are limited to 60 seconds per invocation, but **components can run for up to 300 seconds per invocation**.

Other key limits include:

- [30 minutes of component runtime per UTC day](https://docs.pipedream.com/limits/#execution-time-per-day)
- [192MB of available memory](https://docs.pipedream.com/limits/#memory) and [512 MB of disk on `/tmp`](https://docs.pipedream.com/limits/#disk) during the execution of your code.

## Getting Support

You can get help [on our public Slack](https://pipedream.com/community) or [reach out to our team directly](https://docs.pipedream.com/support/) with any questions or feedback. We'd love to hear from you!

## Found a Bug? Have a Feature to suggest?

Any bugs or feature requests for specific components can be raised in this repo as new Github issues or pull requests.

Pipedream also operates [a roadmap](https://github.com/PipedreamHQ/roadmap) to solicit feature requests for the Pipedream platform at large (the [pipedream.com UI](https://pipedream.com), [workflows](https://docs.pipedream.com/workflows/), the CLI, etc).

You can always [reach out to our team](https://docs.pipedream.com/support/) - we're happy to discuss feedback or help fix a bug.
