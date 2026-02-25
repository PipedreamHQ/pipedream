import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "polar-new-webhook-event",
  name: "New Webhook Event",
  description: "Emit new event when the selected webhook event occurs. [See the API docs](https://polar.sh/docs/api-reference/webhooks/endpoints/create)",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Events",
      description: "The webhook events to listen for",
      options: constants.WEBHOOK_EVENT_OPTIONS,
    },
  },
};
