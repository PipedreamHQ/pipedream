import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Payment Event (Instant)",
  version: "0.0.1",
  key: "paypal-new-payment-event",
  description: "Emits a new event on a new payment webhook event. [See webhooks docs here](https://developer.paypal.com/docs/api/webhooks/v1/#webhooks_post) and [Events Types docs here](https://developer.paypal.com/docs/api/webhooks/v1/#webhooks-event-types_list)",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    paymentEventTypes: {
      propDefinition: [
        common.props.app,
        "paymentEventTypes",
      ],
      optional: false,
    },
  },
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      const events = this.paymentEventTypes === "string"
        ? JSON.parse(this.paymentEventTypes)
        : this.paymentEventTypes;

      return events.map((event) => ({
        name: event,
      }));
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New payment event (${data.event_type}) with ID ${data.resource.id}`,
        ts: Date.parse(data.resource.create_time),
      });
    },
  },
};
