# REST API Example: Create an RSS source

Here, we'll walk through an example of how to create an RSS [event source](/event-sources/) and retrieve events from that source using the [REST API](/api/rest/).

Before you begin, you'll need your [Pipedream API Key](/api/auth/#pipedream-api-key).

## Creating the component

To create a source using the API, you must first [create a **component**](/api/rest/#create-a-component) - the code that runs your source - in your Pipedream account.

To create an RSS component, pass a reference to the `component_url` for the RSS source on Github:

```bash
curl https://api.pipedream.com/v1/components \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/components/rss/rss.js"}'
```

This returns a `200 OK` response with the following payload:

```json
{
  "data": {
    "id": "sc_abc123",
    "code": "component code here",
    "code_hash": "685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1",
    "name": "rss",
    "version": "0.0.1",
    "configurable_props": [
      {
        "name": "url",
        "type": "string",
        "label": "Feed URL",
        "description": "Enter the URL for any public RSS feed."
      },
      {
        "name": "timer",
        "type": "$.interface.timer",
        "default": {
          "intervalSeconds": 900
        }
      }
    ],
    "created_at": 1588866900,
    "updated_at": 1588866900
  }
}
```

Note the `configurable_props` array. **This tells us what values we must pass as inputs when creating a source from this component**. Pipedream refers to these inputs as **props**.

For the RSS component, we see two props — `url` and `timer`. The RSS component fetches items from a specific feed URL, on a set frequency. We see that `timer` has a default value of `900` seconds (15 minutes). If you're OK with that default frequency, you do not need to set a value for that prop when creating a source. If you _do_ want to modify this schedule, you can set it to any integer greater than or equal to 15 seconds (a source can run no more than that).

Now that we know what inputs we need to create our source, let's make an API request to do that. In this example, I'll use a sample feed hosted at `https://rss.m.pipedream.net`. This feed produces new items once every 15 minutes, but to show you how to configure the `timer` prop with a higher frequency, we'll set it to run once a minute:

```bash
curl https://api.pipedream.com/v1/sources \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/components/rss/rss.js", "name": "your-name-here", "configured_props": { "url": "https://rss.m.pipedream.net", "timer": { "intervalSeconds": 60 }}}'
```

If successful, you should get back a `200 OK` response from the API with the following payload:

```json
{
  "data": {
    "id": "dc_abc123",
    "user_id": "u_abc123",
    "component_id": "sc_abc123",
    "configured_props": {
      "url": "https://rss.m.pipedream.net",
      "timer": {
        "cron": null,
        "interval_seconds": 60
      }
    },
    "active": true,
    "created_at": 1589486978,
    "updated_at": 1589486978,
    "name": "your-name-here",
    "name_slug": "your-name-here"
  }
}
```

Visit [https://pipedream.com/sources](https://pipedream.com/sources) to see your running source. You should see the source listed on the left with the name you specified in the API request.

## Fetching new events

The RSS source polls your feed URL for items at the specified frequency. It emits new items as **events** of the following shape:

```json
{
  "permalink": "https://example.com/8161",
  "guid": "https://example.com/8161",
  "title": "Example post",
  "link": "https://example.com/8161"
}
```

### SSE

You can subscribe to new events in real time by listening to the SSE stream tied to this source. Take the `id` from the API response above — `dc_abc123` in our example — and make a request to this endpoint:

```bash
curl -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/sources/dc_abc123/sse"
```

[See the SSE docs for more detail on this interface](/api/sse/).

### REST API

You can also fetch items in batch using the REST API. If you don't need to act on items in real time, and just need to fetch new items from the feed on a regular interval, you can fetch events like so:

```bash
curl -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_BVuN2Q/event_summaries"
```

[See the docs on the `/event_summaries` endpoint](/api/rest/#get-source-events) for more details on the parameters it accepts. For example, you can pass a `limit` param to return only `N` results per page, and paginate over results using the `before` and `after` cursors described in the [pagination docs](/api/rest/#pagination).
