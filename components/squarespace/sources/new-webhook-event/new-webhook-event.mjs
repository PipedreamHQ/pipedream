import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  name: "New Webhook Event",
  version: "0.0.2",
  key: "squarespace-new-webhook-event",
  description: "Emit new event on each webhook event.",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    topics: {
      label: "Event Type",
      description: "The type of the event to listen",
      type: "string[]",
      options: constants.WEBHOOK_EVENTS,
    },
  },
  methods: {
    ...base.methods,
    getWebhookEventTypes() {
      return this.topics;
    },
  },
  async run(event) {
    const { body } = event;

    this.$emit(body, {
      id: body.id,
      summary: `New event with id ${body.id}`,
      ts: new Date(),
    });
  },
};
