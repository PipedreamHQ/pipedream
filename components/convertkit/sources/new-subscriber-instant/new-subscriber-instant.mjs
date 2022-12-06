import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Subscriber Activation (Instant)",
  key: "convertkit-new-subscriber-instant",
  description: "Emit new event when a new subscriber is activated. [See docs here](https://developers.convertkit.com/#create-a-webhook)",
  version: "0.0.1",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return {
        "name": "subscriber.subscriber_activate",
      };
    },
    async processEvent(event) {
      const { body } = event;

      if (!body?.subscriber) {
        return;
      }
      const ts = Date.parse(body.subscriber.created_at);

      this.$emit(body, {
        id: body.subscriber.id,
        summary: `New subscription activation from ${body.subscriber.email_address} created`,
        ts,
      });
    },
  },
};
