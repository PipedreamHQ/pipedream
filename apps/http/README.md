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
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/apps/http/http.js
```

This creates an endpoint you can send any HTTP requests to:

```text
  id: dc_abc123
  name: http
  endpoint: https://myendpoint.m.pipedream.net
```

The CLI will automatically listen for new HTTP requests to this URL, displaying them in your shell as soon as they arrive. Send an HTTP request and you'll see the request appear here.

## What are event sources?

**Event sources turn any API into an event stream, and turn any event stream into an API**.

Sources collect data from services like Github, Stripe, the bitcoin blockchain, RSS feeds, and more. They emit new events produced by the service, which can be consumed by any application via HTTP API or SSE.

Event sources run on Pipedream's infrastructure, but you can retrieve emitted events in your own apps using the Pipedream CLI, HTTP API, or SSE stream tied to your source.

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
- Create a public stream of HTTP requests to share with consumers
- Run any Node.js code on HTTP requests to implement more custom logic

## Docs

See our docs on event sources to learn more:

- Consuming data from streams
- CLI reference
- API reference
- Limits, Troubleshooting, and Support

## Example HTTP sources

Below, you'll find instructions for deploying HTTP sources to solve specific use cases.

**The interface for authoring sources is [pre-1.0](https://semver.org/#spec-item-4) and is subject to change at any time**. But we encourage you to extend these sources or build your own, and we'd love to hear feedback on how the API can be improved.

If you've built a source you think others would find valuable, please submit a pull request to this repo. If you have questions about the source API or any part of the Pipedream platform, you can raise an issue in this repo or [chat us on Slack](https://pipedream.com/community).

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
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/apps/http/http-payload-only.js
```

### Return a custom HTTP status code

You can create an endpoint that responds with any HTTP status code. Run:

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/apps/http/http-custom-status-code.js
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

Sources can be deployed via URL, like in the examples above, or by referencing a local file. Run this command to deploy your source

```bash
pd deploy http-custom-response.js
```

### Authorize inbound requests with a secret

You can run any Node.js code within a source. This lets you implement complex logic to validate the inbound request and issue a custom response.

The [`http-require-secret` source](http-require-secret.js) provides an example of this. Run

```bash
pd deploy https://github.com/PipedreamHQ/pipedream/blob/master/apps/http/http-require-secret.js
```

This will prompt you to enter a **secret**, which you must pass in the `secret` HTTP header for the request to succeed, and for your source to emit an event. Requests without the correct value in this header will fail with a `400 Bad Request` error:

```bash
> curl -s -o /dev/null -w "%{http_code}" https://myendpoint.m.pipedream.net
400

> curl -s -o /dev/null -w "%{http_code}" -H 'secret: 123' https://myendpoint.m.pipedream.net
200
```
