Pipedream is a platform for running hosted, backend components.

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
