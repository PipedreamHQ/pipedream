# Server-Sent Events (SSE)

Pipedream supports [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE) as a destination, enabling you to send events from a workflow directly to a client subscribed to the event stream. 

[[toc]]

## What is SSE?

[Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) (SSE) is a specification that allows servers to send events directly to clients that subscribe to those events, similar to [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) and related server to client push technologies.

Unlike WebSockets, SSE enables one-way communication from server to clients (WebSockets enable bidirectional communication between server and client, allowing you to pass messages back and forth). Luckily, if you only need a client to subscribe to events from a server, and don't require bidirectional communication, SSE is simple way to make that happen.

## What can I do with the SSE destination?

SSE is typically used by web developers to update a webpage with new events in real-time, without forcing a user to reload a page to fetch new data. If you'd like to update data on a webpage in that manner, you can subscribe to your workflow's event stream and handle new events as they come in.

Beyond web browsers, any program that's able to create an [`EventSource` interface](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) can listen for server-sent events delivered from Pipedream. You can run a Node.js script or a Ruby on Rails app that receives server-sent events, for example.

## Sending data to an SSE Destination

You can send data to an SSE Destination in [Node.js code steps](/workflows/steps/code/) using the `$send.sse()` function.

[Add a new Action](/workflows/steps/actions/#adding-a-new-action), then search for "**Code**":

<div>
<img alt="Code action" width="300" src="./images/new-code-step.png">
</div>

Then add this code to that step:

```javascript
$send.sse({
  channel: "events",
  payload: {
    name: "Luke Skywalker"
  }
});
```

**See [this workflow](https://pipedream.com/@dylburger/sse-example-p_ezCdBz/edit)** for an example of how to use `$send.sse()`.

Send a test event to your workflow, then review the section on [Receiving events](#receiving-events) to see how you can setup an `EventSource` to retrieve events sent to the SSE Destination.

`$send.sse()` accepts an object with the following properties:

```javascript
$send.sse({
  channel, // Required, corresponds to the event in the SSE spec
  payload // Required, the event payload
});
```

Again, it's important to remember that **Destination delivery is asynchronous**. If you iterate over an array of values and send an SSE for each:

```javascript
const names = ["Luke", "Han", "Leia", "Obi Wan"];
names.forEach(name => {
  $send.sse({
    channel: "names",
    payload: {
      name
    }
  });
});
```

you won't have to `await` the execution of the SSE Destination requests in your workflow. We'll collect every `$send.sse()` call and defer those requests, sending them after your workflow finishes.

## Receiving events

Once you've sent events to an SSE Destination, you can start receiving a stream of those events in a client by configuring an [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) that connects to the Pipedream SSE stream.

### Retrieving your workflow's event stream URL

First, it's important to note that all events sent to an SSE destination within a workflow are sent to an SSE event stream specific to that workflow. The event stream is tied to the workflow's ID, which you can find by examining the URL of the pipeline in the Pipedream UI. For example, the `p_aBcDeF` in this URL is the pipeline ID:

<div>
<img alt="New code step" width="500" src="./images/pipeline-id.png">
</div>

**Note that the `p_` prefix is part of the workflow ID**.

Once you have the workflow ID, you can construct the event source URL for your SSE destination. That URL is of the following format:

```
http://sdk.m.pipedream.net/pipelines/[YOUR WORKFLOW ID]/sse
```

In the example above, the URL of our event stream would be:

```
http://sdk.m.pipedream.net/pipelines/p_aBcDeF/sse
```

You should be able to open that URL in your browser. Most modern browsers support connecting to an event stream directly, and will stream events without any work on your part to help you confirm that the stream is working.

If you've already sent events to your SSE destination, you should see those events here! We'll return the most recent 100 events delivered to the corresponding SSE destination immediately. This allows your client to catch up with events previously sent to the destination. Then, any new events sent to the SSE destination while you're connected will be delivered to the client.

### Sample code to connect to your event stream

It's easy to setup a simple webpage to `console.log()` all events from an event stream. You can find a lot more examples of how to work with SSE on the web, but this should help you understand the basic concepts.

You'll need to create two files in the same directory on your machine: an `index.html` file for the HTML, and an `sse.js` file to keep the JavaScript that connects to the event stream.

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>SSE test</title>
    <script src="sse.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

**sse.js**

```javascript
const eventSource = new EventSource(
  "http://sdk.m.pipedream.net/pipelines/[YOUR WORKFLOW ID]/sse"
);

eventSource.addEventListener("[YOUR CHANNEL]", function(e) {
  console.log("New event from cron test event stream: ", e);
});
```

**Make sure to add your workflow ID and the name of your channel you specified in your SSE Destination**. Then, open the `index.html` page in your browser. In your browser's developer tools JavaScript console, you should see new events appear as you send them.

Note that the `addEventListener` code will listen specifically for events sent to the **cron_test** `channel` specified in our SSE destination. You can listen for multiple types of events at once by adding multiple event listeners on the client.

**Try triggering more test events from your workflow while this page is open to see how this works end-to-end**.

## `:keepalive` messages

[The SSE spec](https://www.w3.org/TR/2009/WD-eventsource-20090421/#notes) notes that

> Legacy proxy servers are known to, in certain cases, drop HTTP connections after a short timeout. To protect against such proxy servers, authors can include a comment line (one starting with a ':' character) every 15 seconds or so.

Roughly every 15 seconds, we'll send a message with the `:keepalive` comment to keep open SSE connections alive. These comments should be ignored when you're listening for messages using the `EventSource` interface.
