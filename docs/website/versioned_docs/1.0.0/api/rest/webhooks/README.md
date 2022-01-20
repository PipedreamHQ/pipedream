# REST API Example: Webhooks

Pipedream supports webhooks as a way to deliver events to a endpoint you own. Webhooks are managed at an account-level, and you send data to these webhooks using [subscriptions](#subscriptions).

For example, you can run a Twitter [event source](/event-sources) that listens for new tweets. If you [subscribe](#subscriptions) the webhook to this source, Pipedream will deliver those tweets directly to your webhook's URL without running a workflow. 

[[toc]]

## Send events from an existing event source to a webhook

[Event sources](/event-sources) source data from a service / API, emitting events that can trigger Pipedream workflows. For example, you can run a Github event source that emits an event anytime someone stars your repo, triggering a workflow on each new star.

**You can also send the events emitted by an event source to a webhook**.

<div>
<img alt="Github stars to Pipedream" src="./images/webhook-proxy.png">
</div>

### Step 1 - retrieve the source's ID

First, you'll need the ID of your source. You can visit [https://pipedream.com/sources](https://pipedream.com/sources), select a source, and copy its ID from the URL. It's the string that starts with `dc_`:

<div>
<img alt="Source ID" width="300px" src="./images/source-id.png">
</div>

You can also find the ID by running `pd list sources` using [the CLI](/cli/reference/#pd-list).

### Step 2 - Create a webhook

You can create a webhook using the [`POST /webhooks` endpoint](/api/rest/#create-a-webhook). The endpoint accepts 3 params:

- `url`: the endpoint to which you'd like to deliver events
- `name`: a name to assign to the webhook, for your own reference
- `description`: a longer description

You can make a request to this endpoint using `cURL`:

```bash
curl "https://api.pipedream.com/v1/webhooks?url=https://endpoint.m.pipedream.net&name=name&description=description \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

Successful API responses contain a webhook ID in `data.id` — the string that starts with `wh_` — which you'll use in **Step 3**:

```json
{
  "data": {
    "id": "wh_abc123"
    ...
  }
}
```

### Step 3 - Create a subscription

[Subscriptions](/api/rest/#subscriptions) allow you to deliver events from one Pipedream resource to another. In the language of subscriptions, the webhook will **listen** for events **emitted** by the event source.

You can make a request to the [`POST /subscriptions` endpoint](/api/rest/#listen-for-events-from-another-source-or-workflow) to create this subscription. This endpoint requires two params:

- `emitter_id`: the source ID from **Step 1**
- `listener_id`: the webhook ID from **Step 2**

You can make a request to this endpoint using `cURL`:

```bash
curl "https://api.pipedream.com/v1/subscriptions?emitter_id=dc_abc123&listener_id=wh_abc123" \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

If successful, this endpoint should return a `200 OK` with metadata on the subscription. You can also [list your subscriptions](/api/rest/#get-current-user-s-subscriptions) to confirm that it's active.

### Step 4 - Trigger an event

Trigger an event in your source (for example, send a tweet, star a Github repo, etc). You should see the event emitted by the source delivered to the webhook URL.

## Extending these ideas

You can configure _any_ events to be delivered to a webhook: events emitted by event source, or those [emitted by a workflow](/destinations/emit/).

You can also configure an event to be delivered to _multiple_ webhooks by creating multiple webhooks / subscriptions.

<Footer />
