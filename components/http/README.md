## HTTP Event Source

Pipedream is a platform for running hosted, backend components. An HTTP Event Source is essentially a [RequestBin](https://requestbin.com) that can be managed via API.

Components come with a [built-in key-value store](/COMPONENT-API.md#db), an interface for passing input via [props](/COMPONENT-API.md#props), and more. You deploy and manage components using Pipedream's [REST API](https://docs.pipedream.com/api/rest/), [CLI](https://docs.pipedream.com/cli/reference/), or [UI](https://pipedream.com/sources).

[Components can emit events](/COMPONENT-API.md#emit), which can be retrieved programmatically via [CLI](https://docs.pipedream.com/cli/reference/), [API](https://docs.pipedream.com/api/rest/) or [SSE](https://docs.pipedream.com/api/sse/). They can also trigger [Pipedream workflows](https://docs.pipedream.com/workflows/) on every event. For example, you can process items from an RSS feed and access the items via REST API, or trigger code to run on every new item using the SSE interface or a workflow.

## Quickstart

[Install the Pipedream CLI](https://docs.pipedream.com/cli/install/), then run:

```bash
pd deploy http-new-requests
```

This deploys an [HTTP event source](#what-are-http-event-sources) and creates a unique endpoint URL you can send any HTTP requests to:

```text
  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net
```

The CLI will automatically listen for new requests to this URL, displaying them in your shell as soon as they arrive. **Send a test request using the provided cURL command to give it a try**.

You can retrieve requests to this endpoint programmatically, using Pipedream's [REST API](https://docs.pipedream.com/api/rest/#get-source-events), [CLI](https://docs.pipedream.com/cli/reference/#command-reference) or a [private SSE stream](https://docs.pipedream.com/api/sse/) tied to your event source.

You can also run any Node.js code on HTTP requests to filter or transform them, issue a custom HTTP response, and more — [see the example components below](#example-http-sources).
