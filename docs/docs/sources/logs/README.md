# Logs

Sources can produce log using `console` statements, and can throw errors. These logs show up in the sources UI for each source, under **LOGS**. 

[Like events](/event-sources/), logs can also be consumed programmatically:

- Connecting to the [SSE stream](/api/sse/) directly
- Using the [`pd logs`](#pd-logs) CLI command

## SSE

### What is SSE?

[Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE) defines a spec for how servers can send events directly to clients that subscribe to those events, similar to [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) and related server-to-client push technologies.

Unlike WebSockets, SSE enables one-way communication from server to clients (WebSockets enable bidirectional communication between server and client, allowing you to pass messages back and forth). If you only need a client to subscribe to events from a server, and don't require bidirectional communication, SSE is simple way to make that happen.

### Connecting to the SSE stream directly

[Just like for events](/event-sources/), logs are published to a source-specific SSE stream.

To connect to this stream, you'll need to:

- Get the SSE URL for your source using [`pd list streams`](/cli/reference/#pd-list), modifying the URL slightly (see below).
- Connect to the SSE stream, passing your Pipedream API key in the `Authorization` HTTP header using [Bearer Auth](/api/auth/#authorizing-api-requests).

When you run `pd list streams`, you'll see output like the following:

```
λ pd list streams

  NAME                  TYPE   VISIBILITY  SSE
  http                  http   private     https://rt.pipedream.com/sse/dc/dc_abc123/emits
```

This SSE URL points to the `/emits` stream, which contains your source's events. **Change `/emits` to `/observations` to connect to the logs stream**.

[**See this repo**](https://github.com/PipedreamHQ/node-sse-example) for an example Node.js app that processes events from a Pipedream SSE stream.

[Most programming languages provide SSE clients](https://en.wikipedia.org/wiki/Server-sent_events#Libraries) that facilitate interaction with SSE streams. For example, the Node.js example repo uses the [`eventsource` npm package](https://www.npmjs.com/package/eventsource), which implements the [`EventSource` API](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events).

## `pd logs`

The [`pd logs` command](/cli/reference/#pd-logs) streams logs for a source directly to your shell:

```bash
pd logs <source-id-or-name>
```

## Limits

Pipedream stores the last 100 logs (standard output and standard error) for each source.

<Footer />
