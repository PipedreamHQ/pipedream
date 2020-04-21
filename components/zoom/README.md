## Zoom

This directory contains [components](/COMPONENT-API.md) that operate on data from the [Zoom API](https://marketplace.zoom.us/docs/api-reference/introduction).

Most of these components are [event sources](https://docs.pipedream.com/event-sources/). Event sources let you turn any API into an event stream. For example, the [`my-recordings.js`](my-recordings.js) event source polls the Zoom API for new meeting or webinar recordings tied to your user, and [emits](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#thisemit) a new event for every new recording it finds. You can access these events in real-time using a [private SSE stream](https://docs.pipedream.com/api/sse/) tied to your source, or in batch using the [REST API](https://docs.pipedream.com/api/rest/). Or you can trigger [Pipedream workflows](#pipedream-workflows) on every new event.

### Pipedream workflows

You can trigger a [Pipedream workflow](https://docs.pipedream.com/workflows/) — hosted Node.js code — on every new event from any Zoom source. You can find a few example workflows below. Just **Copy** them, connect your Zoom account, and you'll be able to trigger. You can modify or extend these workflows in any way you'd like.

- [Save Zoom Recordings to Amazon S3](https://pipedream.com/@dylburger/save-zoom-recordings-to-amazon-s3-p_PACKJG/readme)

For a deeper introduction to Pipedream, components, and event sources, see the [root `README` in this repo](/README.md), the [component API](/COMPONENT-API.md), or the [docs](https://docs.pipedream.com).

### Docker image - run code on every new Zoom event
