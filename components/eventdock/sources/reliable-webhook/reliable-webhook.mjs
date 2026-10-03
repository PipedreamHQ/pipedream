import common from "../../common/common-webhook.mjs";

export default {
  ...common,
  key: "eventdock-reliable-webhook",
  name: "New Reliable Webhook Event (Instant)",
  description:
    "Emit an event for each reliable webhook delivery from EventDock. EventDock receives your raw provider webhooks (Stripe, Shopify, GitHub, Twilio, or any generic source), retries failures with exponential backoff, holds dead letters in a DLQ, and de-duplicates — then forwards clean events here. [See the docs](https://eventdock.app/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    provider: {
      propDefinition: [
        common.props.eventdock,
        "provider",
      ],
    },
    providerSecret: {
      propDefinition: [
        common.props.eventdock,
        "providerSecret",
      ],
    },
  },
  async run(event) {
    const {
      body, headers = {},
    } = event;

    const meta = this.getEventDockMeta(headers);

    // Emit FIRST, then ack. If $emit throws OR rejects (e.g. Pipedream-side
    // failure), we must NOT tell EventDock the delivery succeeded — otherwise the
    // event is silently lost. We AWAIT $emit so an *async* emit failure is caught
    // here (an un-awaited emit could reject after we'd already acked 200, losing
    // the event). Responding non-2xx lets EventDock retry. The `unique` dedupe
    // (keyed on the EventDock event id via generateMeta) makes that retry safe: a
    // re-delivery of the same event won't double-fire downstream.
    try {
      await this.$emit(
        {
          body,
          headers,
          eventdock: meta,
          deliveredAt: new Date().toISOString(),
        },
        this.generateMeta(meta),
      );
    } catch (err) {
      // Tell EventDock the delivery failed so it retries (any non-2xx).
      this.http.respond({
        status: 500,
        body: { received: false },
      });
      throw err;
    }

    // Only now, after a successful emit, ack so EventDock marks the delivery
    // successful and stops retrying. (EventDock treats any 2xx as delivered.)
    this.http.respond({
      status: 200,
      body: { received: true },
    });
  },
};
