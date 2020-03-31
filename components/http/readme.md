![pipedream](https://i.ibb.co/hB42XLK/github2.png)

<p align="center">
  <a href="https://pipedream.com/community"><img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community"></a>
  <a href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DFollowButton%26query%3Dhttps%253A%252F%252Ftwitter.com%252Fpipedream%26widget%3DButton&ref_src=twsrc%5Etfw&region=follow_link&screen_name=pipedream&tw_p=followbutton"><img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social"></a>
</p>

Pipedream is a platform for running hosted, backend components.

**Pipedream components are reusable Node.js modules that run code on specific events**: HTTP requests and timers. Components are [free to run](#pricing) and [simple to learn](COMPONENT-API.md). Here's a component that spins up a hosted HTTP server on deploy and logs inbound HTTP requests:

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

Components come with a [built-in key-value store](COMPONENT-API.md#servicedb), an interface for passing input via [props](COMPONENT-API.md#props), and more. You deploy and manage components using Pipedream's [REST API](https://docs.pipedream.com/api/rest/), [CLI](https://docs.pipedream.com/cli/reference/), or [UI](https://pipedream.com/sources).

[Components can emit events](/COMPONENT-API.md#thisemit), which can be retrieved programmatically via [CLI](https://docs.pipedream.com/cli/reference/), [API](https://docs.pipedream.com/api/rest/) or [SSE](https://docs.pipedream.com/api/sse/). They can also trigger [Pipedream workflows](https://docs.pipedream.com/workflows/) on every event. For example, you can process items from an RSS feed and access the items via REST API, or trigger code to run on every new item using the SSE interface or a workflow. Components that emit events are called **event sources**.

## Usage

Install the Pipedream CLI:

```bash
curl https://cli.pipedream.com/install | sh
```

Then deploy a component from the registry:

```bash
pd deploy   # prompts you to select a component and pass required options
```

Get started by reviewing the quickstart on [HTTP Event Sources](components/http#quickstart), or review [the docs](#docs) to learn more.
