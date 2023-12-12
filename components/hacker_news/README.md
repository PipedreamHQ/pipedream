![pipedream](https://i.ibb.co/LPhXtH1/logo.png)

<p align="center">
  <a href="https://pipedream.com/community"><img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community"></a>
  <a href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3Dhttps%253A%252F%252Ftwitter.com%252Fpipedream%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=pipedream&tw_p=followbutton"><img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social"></a>
</p>

## "Google Alerts" for Hacker News

[Google Alerts](https://www.google.com/alerts) let you "monitor the web for interesting new content" and many of our users like to do the same for [Hacker News](https://news.ycombinator.com/).

The Hacker News components turn the Hacker News API into an event stream based on your given keyword(s).

[Components can emit events](/COMPONENT-API.md#emit), which can be retrieved programmatically via [CLI](https://docs.pipedream.com/cli/reference/), [API](https://docs.pipedream.com/api/rest/) or [SSE](https://docs.pipedream.com/api/sse/). They can also trigger [Pipedream workflows](https://docs.pipedream.com/workflows/) on every event. For example, you can process items from an RSS feed and access the items via REST API, or trigger code to run on every new item using the SSE interface or a workflow.

## Usage

<a href="https://pipedream.com/sources?action=create&key=hacker_news-new-stories-by-keyword"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>

or:

[Install the Pipedream CLI](https://docs.pipedream.com/cli/install/), then deploy the Hacker News "new stories by keyword" component from the registry:

```bash
pd deploy hacker_news-new-stories-by-keyword
```

Or, deploy the "new comments by keyword" component from the registry:

```bash
pd deploy hacker_news-new-stories-by-keyword
```

Submit your keyword and deploy your component.

**You have turned the Hacker News API into a real time event stream!**

<img src="https://i.ibb.co/cbTZ0T4/Screen-Shot-2020-04-10-at-1-11-31-PM.png">

## Docs

- [Why use components?](#why-use-components)
- [Component API](COMPONENT-API.md)
- [Event Sources](https://docs.pipedream.com/event-sources/)
- [HTTP Event Sources Quickstart](https://github.com/PipedreamHQ/pipedream/tree/master/interfaces/http)
- [REST API Reference](https://docs.pipedream.com/api/rest/)
- [SSE Reference](https://docs.pipedream.com/api/sse/)
- [CLI Reference](https://docs.pipedream.com/cli/reference/)
- [Workflows](https://docs.pipedream.com/workflows/)

## Why use components?

Components are similar to serverless functions, like those offered by AWS Lambda. You don't have to manage the server that runs the code — components are hosted on Pipedream infrastructure — and they run on specific events like HTTP requests and timers.

But we believe components are simpler to learn, write, and maintain for many use cases. They let you focus more on the code, and less on the configuration of the function and its associated services:

- You can configure an HTTP server [via props](/COMPONENT-API.md#http), and can use a [built-in key-value store](/COMPONENT-API.md#db) to manage state. Components creates the HTTP interface for you on deploy, and the key-value store comes for free: there's no need to create these resources manually.
- Components are meant to be reusable. They can accept input via [props](/COMPONENT-API.md#props), which a user sets on deploy.
- Components are self-contained. Their name, version, props, and code are all defined in one file. This makes components easy to understand at a glance, and easy to fork and modify.

This is also an early release. [The component API](/COMPONENT-API.md) will improve over time. **Right now, we're looking for any and all [feedback](https://pipedream.com/community)**. Tell us what you're building, what works and what doesn't, and anything you think would improve the product.

## Pricing

Pipedream is currently free, subject to the [limits noted below](#limits). Paid tiers for higher volumes are coming soon.

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Limits

Components are subject to the [limits of the Pipedream platform](https://docs.pipedream.com/limits/).

## Found a Bug? Have a Feature to suggest?

Any bugs or feature requests for specific components can be raised in this repo as new Github issues or pull requests.

Pipedream also operates [a roadmap](https://github.com/PipedreamHQ/roadmap) to solicit feature requests for the Pipedream platform at large (the [pipedream.com UI](https://pipedream.com), [workflows](https://docs.pipedream.com/workflows/), the CLI, etc).

You can always [reach out to our team](https://docs.pipedream.com/support/) - we're happy to discuss feedback or help fix a bug.
