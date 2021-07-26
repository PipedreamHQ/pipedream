# HTTP

HTTP Destinations allow you to send data to another HTTP endpoint URL outside of Pipedream. This can be an endpoint you own and operate, or a URL tied to a service you use (for example, a [Slack Incoming Webhook](https://api.slack.com/incoming-webhooks)).

[[toc]]

## Using `$send.http()`

You can send HTTP requests in [Node.js code steps](/workflows/steps/code/) using `$send.http()`.

```javascript
$send.http({
  method: "POST",
  url: "[YOUR URL HERE]",
  data: {
    name: "Luke Skywalker",
  },
});
```

`$send.http()` accepts an object with all of the following properties:

```javascript
$send.http({
  method, // Required, HTTP method, a string, e.g. POST, GET
  url, // Required, the URL to send the HTTP request to
  data, // HTTP payload
  headers, // An object containing custom headers, e.g. { "Content-Type": "application/json" }
  params, // An object containing query string parameters as key-value pairs
  auth, // An object that contains a username and password property, for HTTP basic auth
});
```

**Destination delivery is asynchronous**: the HTTP requests are sent after your workflow finishes. This means **you cannot write code that operates on the HTTP response**. The benefit of using `$send.http()`, though, is that these HTTP requests also don't count against your [compute time quota](/limits/#compute-time-per-day) on the [free tier](/pricing/#developer-tier).

If you iterate over an array of values and send an HTTP request for each:

```javascript
const names = ["Luke", "Han", "Leia", "Obi Wan"];
names.forEach((name) => {
  $send.http({
    method: "POST",
    url: "[YOUR URL HERE]",
    data: {
      name,
    },
  });
});
```

you won't have to `await` the execution of the HTTP requests in your workflow. We'll collect every `$send.http()` call and defer those HTTP requests, sending them after your workflow finishes.

## HTTP Destination delivery

HTTP Destination delivery is handled asynchronously, separate from the execution of a workflow. However, we deliver the specified payload to HTTP destinations for every event sent to your workflow.

Generally, this means it should only take a few seconds for us to send the event to the destination you specify. In some cases, delivery will take longer.

The time it takes to make HTTP requests sent with `$send.http()` does not count against your workflow quota.

## HTTP request and response logs

Below your code step, you'll see both the data that was sent in the HTTP request, and the HTTP response that was issued. If you issue multiple HTTP requests, we'll show the request and response data for each.

## What if I need to access the HTTP response in my workflow?

Since HTTP requests sent with `$send.http()` are sent asynchronously, after your workflow runs, **you cannot access the HTTP response in your workflow**.

If you need to access the HTTP response data in your workflow, [use `axios`](/workflows/steps/code/nodejs/http-requests/) or another HTTP client.

## Timeout

The timeout on HTTP request sent with `$send.http()` is currently **5 seconds**. This time includes DNS resolution, connecting to the host, writing the request body, server processing, and reading the response body.

Any requests that exceed 5 seconds will yield a `timeout` error. 

## Retries

Currently, Pipedream will not retry any failed request. If your HTTP destination endpoint is down, or returns an error response, we'll display that response in the observability associated with the Destination in the relevant step.

## IP addresses for Pipedream HTTP requests

When you make an HTTP request using `$send.http()`, the traffic will come from one of the following IP addresses:

<<< @/docs/snippets/public-node-ips.txt

This list may change over time. If you've previously whitelisted these IP addresses and are having trouble sending HTTP requests to your target service, please check to ensure this list matches your firewall rules.

::: warning
These IP addresses are tied specifically to the `$send.http()` service. If you send traffic directly from a workflow, it will be sent from one of Pipedream's general range of IP addresses. [See our networking docs for more information](/workflows/networking/).
:::

<Footer />
