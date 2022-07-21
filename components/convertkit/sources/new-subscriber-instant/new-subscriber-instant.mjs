import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Subscriber Activation (Instant)",
  key: "convertkit-new-subscriber-instant",
  description: "Emit new event when a new subscriber is activated. [See docs here](https://developers.convertkit.com/#create-a-webhook)",
  version: "0.0.2",
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
    async proccessEvent(event) {
      const { subscriber } = event.body;

      if (!subscriber) return;
      const ts = Date.parse(subscriber.created_at);

      this.$emit(subscriber, {
        id: subscriber.id,
        summary: `New subscription activation from ${subscriber.email_address} created`,
        ts,
      });
    },
  },
};
