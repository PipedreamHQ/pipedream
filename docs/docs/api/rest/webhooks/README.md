# REST API Example: Webhooks

Pipedream supports webhooks as a way to deliver events to a endpoint you own. Webhooks are managed at an account-level, and you send data to these webhooks using [subscriptions](#subscriptions).

For example, you can run a Twitter [event source](/event-sources) that listens for new tweets. If you [subscribe](#subscriptions) the webhook to this source, Pipedream will deliver those tweets directly to your webhook's URL without running a workflow.

[[toc]]

## Send events from an existing event source to a webhook

1. Get the source's ID
2. Create a webhook
3. Create a subscription
4. Trigger an event

## Forward events from a source to a webhook

In this example, you'll learn how to use the REST API to:

1. [Create an HTTP event source](#create-the-http-event-source)
2. [Create a Pipedream webhook that points to your endpoint](#create-the-webhook)
3. [Forward events emitted by this source to a webhook](#forward-events-to-your-webhook)

This allows you to use Pipedream as a webhook proxy: Pipedream receives the initial webhook, logs it for examination, and forwards the HTTP payload to your endpoint:

<div>
<img alt="Webhook proxy" src="./images/webhook-proxy.png">
</div>

You can even configure the HTTP source to deliver events to multiple webhooks and sources:

**TO DO**

### Create the HTTP event source

Creating an HTTP event source generates a unique URL you can send any requests to. You can create this source using the [`POST /sources` endpoint](/api/rest/#create-a-source):

```bash
curl https://api.pipedream.com/v1/sources \
  -H "Authorization: Bearer XXX" -vvv \
  -H "Content-Type: application/json" \
  -d '{"key": "http-new-requests-payload-only", "name": "test-endpoint" }'
```

This will return the HTTP endpoint tied to the source

```json
{
  "data": {
    "id": "dc_3pulkPk",
    "component_id": "sc_MeikZz",
    "configured_props": {
      "http": {
        "endpoint_url": "https://endpoint.m.pipedream.net"
      }
    }
  }
}
```

**TO DO**

### Create the webhook

### Forward events to your webhook

<Footer />
