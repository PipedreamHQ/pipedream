![pipedream](https://i.ibb.co/hB42XLK/github2.png)

[![Join us on Slack](https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community)
[![Twitter Follow](https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social)](https://twitter.com/pipedream)

## Usage

To install the Pipedream CLI, run:

```bash
curl https://cli.pipedream.com/install | sh
```

You can use the CLI to subscribe to public event streams:

```bash
pd events -f @pd/random
```

or create an event stream of your own:

```bash
pd deploy   # prompts you to select a source and pass required options
```

Check out our guide on [HTTP Event Sources](/apps/http/), or review [the docs](https://docs.pipedream.com) for a detailed overview of the CLI, and for more examples of deploying specific components.

## What are Event Sources?

**Event sources turn any API into an event stream**.

Sources collect data from services like Github, Stripe, the bitcoin blockchain, RSS feeds, and more. They emit new events produced by the service, which can be consumed by any application via HTTP API or SSE.

Event sources run on Pipedream's infrastructure, but you can retrieve emitted events in your own apps using the Pipedream CLI, HTTP API, or SSE stream tied to your source.

## Documentation

For details on how to use Pipedream CLI and the rest of the Pipedream platform, please review our [documentation](https://docs.pipedream.com).

## Found a Bug? Want to Suggest a Feature?

Any bugs or feature requests for specific components, or for the Pipedream CLI, can be raised here as new Github issues.
