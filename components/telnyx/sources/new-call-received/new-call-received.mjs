import common from "../common/base.mjs";

export default {
  ...common,
  key: "telnyx-new-call-received",
  name: "New Call Received",
  description: "Emit new event on an incoming call to a Call Control Application. [See the documentation](https://developers.telnyx.com/api/webhooks/get-webhook-deliveries)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.telnyxApp.listWebhookDeliveries;
    },
    getParams(lastTs) {
      return {
        "filter[event_type]": "call.initiated",
        "filter[started_at][gte]": lastTs,
      };
    },
    getTs(event) {
      return event.webhook.occurred_at;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New call from: ${event.webhook.payload.from}`,
        ts: Date.parse(this.getTs(event)),
      };
    },
  },
};
