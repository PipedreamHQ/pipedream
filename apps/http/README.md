![pipedream](https://i.ibb.co/hB42XLK/github2.png)

<p align="center">
  <img src="https://img.shields.io/badge/-Join%20us%20on%20Slack-green?logo=slack&logoColor=34d28B&labelColor=150d11&color=34d28B&logoWidth=18&link=https%3A%2F%2Fpipedream.com%2Fcommunity&link=https%3A%2F%2Fpipedream.com%2Fcommunity)](https://pipedream.com/community">
  <img src="https://img.shields.io/twitter/follow/pipedream?label=Follow%20%40pipedream&style=social">
</p>

# HTTP Event Sources

## Quickstart

To install the Pipedream CLI, run:

```bash
curl https://cli.pipedream.com/install | sh
```

Then run

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http.js
```

This deploys an [HTTP event source](#what-are-http-event-sources) and creates an endpoint you can send any HTTP requests to:

```text
  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net
```

The CLI will automatically listen for new requests to this URL, displaying them in your shell as soon as they arrive. **Send a test request to give it a try**.

You can retrieve requests to this endpoint programmatically, using Pipedream's [REST API](https://docs.pipedream.com/api/rest/#get-source-events), [CLI](https://docs.pipedream.com/cli/reference/#command-reference) or a [private SSE stream](https://docs.pipedream.com/api/sse/) specific to your event source.

You can also run any Node.js code on HTTP requests to filter or transform them, issue a custom HTTP response, and more — [see the example components below](#example-http-sources).

## Reference

<!--ts-->

- [What are Event Sources?](#what-are-event-sources)
- [What are HTTP event sources?](#what-are-http-event-sources)
- [What are components?](#what-are-components)
- [Docs](#docs)
- [Example HTTP sources](#example-http-sources)
  - [Emit only the HTTP payload instead of the whole event](#emit-only-the-http-payload-instead-of-the-whole-event)
  - [Return a custom HTTP status code](#return-a-custom-http-status-code)
  - [Issue a completely custom HTTP response (status, body, headers)](#issue-a-completely-custom-http-response-status-body-headers)
  - [Authorize inbound requests with a secret](#authorize-inbound-requests-with-a-secret)
- [Consuming event data from your own app, outside Pipedream](#consuming-event-data-from-your-own-app-outside-pipedream)
  - [How to emit events](#how-to-emit-events)
  - [Retrieving events programmatically](#retrieving-events-programmatically)
- [Logs](#logs)
- [Using npm packages](#using-npm-packages)
- [Pricing](#pricing)
- [Limits](#limits)
- [Getting Support](#getting-support)

<!--te-->

## What are Event Sources?

**Event sources turn any API into an event stream, and turn any event stream into an API**.

Sources collect data from services like Github, Stripe, the bitcoin blockchain, RSS feeds, and more. They emit new events produced by the service, which can be consumed by any application via [REST API](https://docs.pipedream.com/api/rest/) or SSE.

Event sources run on Pipedream's infrastructure, but you can retrieve emitted events in your own app using the [Pipedream CLI](https://docs.pipedream.com/cli/reference/), [REST API](https://docs.pipedream.com/api/rest/), or [SSE stream](https://docs.pipedream.com/api/sse/) tied to your source.

## What are HTTP event sources?

HTTP sources are the simplest possible event source. When you create an HTTP source,

- You get a unique HTTP endpoint that you can send any HTTP request to.
- You can view the details of any HTTP request sent to your endpoint: its payload, headers, and more.
- You can delete the source and its associated events once you're done.

HTTP sources are essentially [request bins](https://requestbin.com) that can be managed via API.

But HTTP sources provide more advanced functionality. You can:

- [Return custom HTTP responses](#issue-a-completely-custom-http-response-status-body-headers)
- [Emit a subset of the HTTP request](#emit-only-the-http-payload-instead-of-the-whole-event)
- Filter specific requests (for example, you can [require an secret be present on requests](#authorize-inbound-requests-with-a-secret))
- Run any Node.js code on HTTP requests to implement more custom logic

## What are components?

[Pipedream components](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md) are Node.js modules that run code on specific events: HTTP requests, timers, and more. Components are meant to be small, self-contained, and reusable. Components run on Pipedream's infrastructure.

Components are [**free to run**](#pricing) and [simple to learn](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md). They come with a [built-in key-value store](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#servicedb), a way to pass input [via props](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#props), and more.

Components can **emit** events. Components that emit events are called **event sources**. **This `README` refers to components and sources interchangeably, since all the HTTP example components emit events, and are therefore also sources**.

Any emitted events can be retrieved using the [Pipedream CLI](https://docs.pipedream.com/cli/reference/), [REST API](https://docs.pipedream.com/api/rest/), or [SSE stream](https://docs.pipedream.com/api/sse/) tied to your source.

## Docs

- [What are Event Sources?](https://docs.pipedream.com/event-sources/)
- [REST API Reference](https://docs.pipedream.com/api/rest/)
- [SSE Reference](https://docs.pipedream.com/api/sse/)
- [CLI Reference](https://docs.pipedream.com/cli/reference/)
- [Support](https://docs.pipedream.com/support/)

## Example HTTP sources

Below, you'll find instructions for deploying HTTP sources to solve specific use cases.

**The interface for authoring components is in preview, and is subject to change at any time**. We encourage you to extend these components or tinker on your own, and we'd love to hear feedback on how [the component API](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md) can be improved.

If you've built a component you think others would find valuable, please submit a pull request to this repo. If you have questions about the [component API](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md) or any part of the Pipedream platform, you can raise an issue in this repo or [chat us on Slack](https://pipedream.com/community).

### Emit only the HTTP payload instead of the whole event

The [basic HTTP source](http.js) emits an event that contains the [HTTP payload](https://requestbin.com/blog/working-with-webhooks/#http-payload-body), [method](https://requestbin.com/blog/working-with-webhooks/#http-methods-get-and-post), [headers](https://requestbin.com/blog/working-with-webhooks/#http-header), and more:

```json
{
  "body": "{\"name\": \"Luke\"}",
  "headers": {
    "accept": "*/*",
    "host": "myendpoint.m.pipedream.net",
    "user-agent": "curl/7.64.1",
    "version": "HTTP/1.1",
    "x-amzn-trace-id": "Root=1-5e55a17a-4befbf1076580f6c0569ee34",
    "x-forwarded-for": "1.1.1.1",
    "x-forwarded-port": "443",
    "x-forwarded-proto": "https"
  },
  "method": "POST",
  "path": "/",
  "query": {}
}
```

Sometimes, you might not care about the HTTP metadata, and just want to retrieve the HTTP payload. The [`http-payload-only` source](http-payload-only.js) emits just the payload:

```json
{
  "body": "{\"name\": \"Luke\"}"
}
```

To deploy this source, run:

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http-payload-only.js
```

### Return a custom HTTP status code

You can create an endpoint that responds with any HTTP status code. Run:

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http-custom-status-code.js
```

This will prompt you to enter the **status** you'd like to return. For example, I can enter `204`, deploy my source, and my endpoint will return a `204` status code on all requests:

```bash
> curl -s -o /dev/null -w "%{http_code}" https://myendpoint.m.pipedream.net
204
```

### Issue a completely custom HTTP response (status, body, headers)

A source can issue a custom HTTP status code, payload, and headers. [The `http-custom-response` source](http-custom-response.js) provides an example.

The `this.http.respond()` method accepts an object with the following properties:

```javascript
this.http.respond({
  status: 200,
  headers: { "X-My-Custom-Header": "test" },
  body: event // This can be any string, object, or Buffer
});
```

To modify this source, download the file from Github or clone the repo locally. Edit the source, and in the directory where the file lives.

Sources can be deployed via URL, like in the examples above, or by referencing a local file. Run this command to deploy your source:

```bash
pd deploy http-custom-response.js
```

### Authorize inbound requests with a secret

You can run any Node.js code within a source. This lets you implement complex logic to validate the inbound request and issue a custom response.

The [`http-require-secret` source](http-require-secret.js) provides an example of this. Run

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http-require-secret.js
```

This will prompt you to enter a **secret**, which you must pass in the `secret` HTTP header for the request to succeed, and for your source to emit an event. Requests without the correct value in this header will fail with a `400 Bad Request` error:

```bash
> curl -s -o /dev/null -w "%{http_code}" https://myendpoint.m.pipedream.net
400

> curl -s -o /dev/null -w "%{http_code}" -H 'secret: 123' https://myendpoint.m.pipedream.net
200
```

## Consuming event data from your own app, outside Pipedream

All of the [example components above](#example-http-sources) **emit** events. Emitted events appear in the **EVENTS** section of the UI for your source. You can also access these events programmatically, in your own app, using Pipedream APIs.

### How to emit events

Within your component's [`run` method](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#run), pass the data you'd like to emit to the `this.$emit` function:

```javascript
this.$emit({
  name: "Luke Skywalker"
});
```

Each time you run `this.$emit()`, you emit the data as an **event**.

### Retrieving events programmatically

Events can be retrieved using the [REST API](https://docs.pipedream.com/api/rest/#get-source-events), [CLI](https://docs.pipedream.com/cli/reference/#pd-events), [or SSE stream tied to your source](https://docs.pipedream.com/api/sse/). For example, you can use the CLI to retrieve the last 10 events:

```bash
λ pd events -n 10 <source-name>
{ name: "Luke Skywalker" }
{ name: "Leia Organa" }
{ name: "Han Solo" }
```

This makes it easy to retrieve data processed by your component from another app. Typically, you'll want to use the [REST API](https://docs.pipedream.com/api/rest/#get-source-events) to retrieve events in batch, and connect to the [SSE stream](https://docs.pipedream.com/api/sse/) to process them in real time.

## Logs

Each time your job runs, Pipedream marks its start and end times in the **LOGS** attached to your source.

Any standard output or errors rased by your source are also logged here. You can watch these logs in realtime using the `pd logs` CLI command:

```bash
pd logs <source-name>
```

## Using npm packages

To use an npm package in a component, just `require` it:

```javascript
const _ = require("lodash");
```

When you deploy a component, Pipedream downloads these packages and bundles them with your deployment. There's no need to include a `package.json` file with your component.

Some packages — for example, packages like [Puppeteer](https://pptr.dev/), which includes large dependencies like Chromium — may not work on Pipedream. Please [reach out](https://docs.pipedream.com/support/) if you encounter a specific issue.

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
