import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rhombus-new-button-event-instant",
  name: "New Button Event (Instant)",
  description: "Emit new event when a new button event is created. [See the documentation](https://apidocs.rhombus.com/reference/subscribezapierwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "BUTTON_EVENTS";
    },
  },
  sampleEmit,
};
