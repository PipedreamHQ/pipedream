# Server-Sent Events (SSE)

[[toc]]

## Overview

As soon as you deploy an event source, Pipedream creates a private [SSE stream](#what-is-sse) linked to that source. Each event emitted by the source is published to this SSE stream, so your app can subscribe to the stream to process new events. 

## What is SSE?

[Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE) defines a spec for how servers can send events directly to clients that subscribe to those events, similar to [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) and related server-to-client push technologies.

Unlike WebSockets, SSE enables one-way communication from server to clients (WebSockets enable bidirectional communication between server and client, allowing you to pass messages back and forth). If you only need a client to subscribe to events from a server, and don't require bidirectional communication, SSE is simple way to make that happen.

## Connecting to the SSE stream directly

To process events from your source's SSE stream, you'll need to:

- Get the SSE URL for your source's events using [`pd list streams`](/cli/reference/#pd-list). You'll see your stream's URL under the **SSE** header.
- Connect to the SSE stream, passing your Pipedream API key in the `Authorization` HTTP header using [Bearer Auth](/api/auth/#authorizing-api-requests).

[**See this repo**](https://github.com/PipedreamHQ/node-sse-example) for an example Node.js app that processes events from a Pipedream SSE stream.

[Most programming languages provide SSE clients](https://en.wikipedia.org/wiki/Server-sent_events#Libraries) that facilitate interaction with SSE streams. For example, the Node.js example repo uses the [`eventsource` npm package](https://www.npmjs.com/package/eventsource), which implements the [`EventSource` API](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events).

## Subscribe to new events using the Pipedream CLI

The [`pd events` command](/cli/reference/#pd-events) connects to the SSE stream for a source and prints new events as they're emitted:

```bash
pd events -f <source-id-or-name>
```

This is the easiest way to interact with streams, especially if you only need to manually inspect events, or just want to save them to a file on disk.

## `:sse-handshake` messages

Every 15 seconds, we'll send a message with the `:sse-handshake` comment to keep open SSE connections alive. These comments should be automatically ignored when you're listening for messages using the [`EventSource` API](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events).

We send these because [the SSE spec](https://www.w3.org/TR/2009/WD-eventsource-20090421/#notes) notes that

> Legacy proxy servers are known to, in certain cases, drop HTTP connections after a short timeout. To protect against such proxy servers, authors can include a comment line (one starting with a ':' character) every 15 seconds or so.

<Footer />
