import common from "../common/common.mjs";
import { WEBHOOK_EVENT_OPTIONS } from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frame-new-webhook-event-instant",
  name: "New Webhook Event (Instant)",
  description:
    "Emit new event when a new project is created. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.0.2",
  type: "source",
  sampleEmit,
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
    getSummary(body) {
      return `New Event${body
        ? ` (${body?.type})`
        : ""}`;
    },
    getHookData() {
      return this.eventTypes;
    },
  },
};
