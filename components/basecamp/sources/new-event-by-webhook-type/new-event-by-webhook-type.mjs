import constants from "../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-event-by-webhook-type",
  name: "New Webhook Event (Instant)",
  description: "Emit events of one or more selected types. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#webhooks)",
  version: "0.0.9",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    webhookTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the types of events to be emitted. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#webhooks) for more information.",
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
