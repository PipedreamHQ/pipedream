import constants from "../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-event-by-webhook-type",
  name: "New Event By Webhook Type (Instant)",
  description: "Emit new event based on the selected webhook type. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#create-a-webhook)",
  version: "0.0.7",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    webhookTypes: {
      type: "string[]",
      label: "Webhook Types",
      description: "Select types of webhook for listening.",
      options: constants.WEBHOOK_TYPE_OPTS,
    },
  },
  methods: {
    ...common.methods,
    getWebhookTypes() {
      return this.webhookTypes;
    },
    filterEvent(event) {
      return event;
    },
  },
};
