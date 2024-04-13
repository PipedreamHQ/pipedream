import common from "../common/common.mjs";
import { WEBHOOK_EVENT_OPTIONS } from "../../common/constants.mjs";

export default {
  ...common,
  key: "frame-new-webhook-event-instant",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when a new project is created. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of events to listen for.",
      options: WEBHOOK_EVENT_OPTIONS,
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New Event";
    },
    getHookData() {
      return this.eventTypes;
    },
  },
};
