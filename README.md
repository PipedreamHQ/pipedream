![pipedream](https://i.ibb.co/hB42XLK/github2.png)

<p align="center">
  <img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community">
  <img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social">
</p>

## Usage

Install the Pipedream CLI:

```bash
curl https://cli.pipedream.com/install | sh
```

Then deploy a component:

```bash
pd deploy   # prompts you to select a component and pass required options
```

Check out our quickstart for [HTTP Event Sources](/components/http/) or review [the docs](#docs) to learn more.

## What are components?

[Pipedream components](COMPONENT-API.md) are Node.js modules that run code on specific events: HTTP requests, timers, and more. Components are meant to be small, self-contained, and reusable. Components run on Pipedream's infrastructure.

Components are [**free to run**](#pricing) and [simple to learn](COMPONENT-API.md). They come with a [built-in key-value store](COMPONENT-API.md#servicedb), a way to pass input via [props](COMPONENT-API.md#props), and more.

Components can **emit** events, which can be retrieved programmatically using the [Pipedream CLI](https://docs.pipedream.com/cli/reference/), [REST API](https://docs.pipedream.com/api/rest/), or [SSE](https://docs.pipedream.com/api/sse/). Components that emit events are called **event sources**.

## What are Event Sources?

**Event sources turn any API into an event stream, and turn any event stream into an API**.

Sources collect data from services like Github, Stripe, the bitcoin blockchain, RSS feeds, and more. They emit new events produced by the service, which can be consumed by any application via [REST API](https://docs.pipedream.com/api/rest/) or [SSE](https://docs.pipedream.com/api/sse/).

Event sources run on Pipedream's infrastructure, but you can retrieve emitted events in your own app using the [Pipedream CLI](https://docs.pipedream.com/cli/reference/), [REST API](https://docs.pipedream.com/api/rest/), or [SSE stream](https://docs.pipedream.com/api/sse/) tied to your source.

## Docs

- [What are Event Sources?](https://docs.pipedream.com/event-sources/)
- [HTTP Event Sources Quickstart](https://github.com/PipedreamHQ/pipedream/tree/master/components/http)
- [REST API Reference](https://docs.pipedream.com/api/rest/)
- [SSE Reference](https://docs.pipedream.com/api/sse/)
- [CLI Reference](https://docs.pipedream.com/cli/reference/)

## Component API

See [the component API docs](COMPONENT-API.md).

## Pricing

Pipedream is currently free (paid tiers are coming soon), subject to the [limits noted below](#limits).

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
