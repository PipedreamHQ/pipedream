# REST API example: Create an RSS source

Here, we'll walk through an example of how to create an RSS [event source](/event-sources/) and retrieve events from that source using the [REST API](/api/rest/). 

Before you begin, you'll need your [Pipedream API Key](/api/auth/#pipedream-api-key).

## Find the details of the source you'd like to create

To create an event source using Pipedream's REST API, you'll need two things:

- The `key` that identifies the component by name
- The `props` - input data - required to create the source

You can find the `key` by reviewing the code for the source, [in Pipedream's Github repo](https://github.com/PipedreamHQ/pipedream/tree/master/components).

In the `components/` directory, you'll see a list of apps. Navigate to the app-specific directory for your source, then visit the `sources/` directory in that dir to find your source. For example, to create an RSS source, visit the [`components/rss/sources/new-item-in-feed/new-item-in-feed.js` source](https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js).

The `key` is a globally unique identifier for the source. You'll see the `key` for this source near the top of the file:

```javascript
key: "rss-new-item-in-feed",
```

Given this key, make an API request to the `/components/registry/{key}` endpoint of Pipedream's REST API:

```bash
curl https://api.pipedream.com/v1/components/registry/rss-new-item-in-feed \
  -H "Authorization: Bearer XXX" -vvv \
  -H "Content-Type: application/json"
```

This returns information about the component, including a `configurable_props` section that lists the input you'll need to provide to create the source:

```json
"configurable_props": [
  {
    "name": "rss",
    "type": "app",
    "app": "rss"
  },
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
```

In this specific case, you can ignore the `rss` "app" prop. The other two props — `url` and `timer` — are inputs that you can control:

- `url`: the URL to the RSS feed
- `timer` (optional): the frequency at which you'd like to poll the RSS feed for new items. By default, this source will poll for new items every 15 minutes.

## Creating the source

To create an RSS event source, make an HTTP POST request to the `/v1/sources` endpoint of Pipedream's REST API, passing the `url` you'd like to poll and the frequency at which you'd like to run the source in the `timer` object. In this example, we'll run the source once every 60 seconds.

```bash
curl https://api.pipedream.com/v1/sources \
  -H "Authorization: Bearer XXX" -vvv \
  -H "Content-Type: application/json" \
  -d '{"key": "rss-new-item-in-feed", "name": "test-rss", "configured_props": { "url": "https://rss.m.pipedream.net", "timer": { "intervalSeconds": 60 }}}'
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
