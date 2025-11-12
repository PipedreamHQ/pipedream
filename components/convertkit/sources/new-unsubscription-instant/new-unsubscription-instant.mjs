import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Unsubscriber Activation (Instant)",
  key: "convertkit-new-unsubscription-instant",
  description: "Emit new event when a user  unsubscribers. [See docs here](https://developers.convertkit.com/#create-a-webhook)",
  version: "0.0.3",
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
    async processEvent(event) {
      const { body } = event;

      if (!body?.subscriber) {
        return;
      }
      const ts = Date.parse(body.subscriber.created_at);

      this.$emit(body, {
        id: body.subscriber.id,
        summary: `New unsubscription activation from ${body.subscriber.email_address} created`,
        ts,
      });
    },
  },
};
