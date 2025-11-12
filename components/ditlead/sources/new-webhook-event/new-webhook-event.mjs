import common from "../common/base.mjs";
import { WEBHOOK_EVENT_TYPES } from "../../common/constants.mjs";

export default {
  ...common,
  key: "ditlead-new-webhook-event",
  name: "New Webhook Event",
  description: "Emit new events according to the selected event types. [See the documentation](https://ditlead.com/developer/api#tag/Webhook/paths/~1v1~1webhook/post)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select one or more event types to listen for.",
      options: WEBHOOK_EVENT_TYPES,
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return this.eventTypes;
    },
  },
};
