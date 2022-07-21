import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Subscriber Activation (Instant)",
  key: "convertkit-new-unsubscription-instant",
  description: "Emit new event when a user  unsubscribers. [See docs here](https://developers.convertkit.com/#create-a-webhook)",
  version: "0.0.2",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return {
        "name": "subscriber.subscriber_unsubscribe",
      };
    },
    async proccessEvent(event) {
      const { subscriber } = event.body;

      if (!subscriber) return;
      const ts = Date.parse(subscriber.created_at);

      this.$emit(subscriber, {
        id: subscriber.id,
        summary: `New unsubscription activation from ${subscriber.email_address} created`,
        ts,
      });
    },
  },
};
