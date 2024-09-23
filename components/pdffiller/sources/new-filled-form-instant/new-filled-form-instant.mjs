import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pdffiller-new-filled-form-instant",
  name: "New Filled Form (Instant)",
  description: "Emit new event when a form is filled out.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventId() {
      return "fill_request.done";
    },
    getSummary(body) {
      return `New filled form with ID: ${body["event_data[fill_request][filled_form][id]"]}`;
    },
  },
  sampleEmit,
};
