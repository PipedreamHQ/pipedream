import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence_data_center-page-updated",
  name: "Page Updated (Instant)",
  description: "Emit new event when a page is updated in Confluence Data Center.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "page_updated",
      ];
    },
  },
  sampleEmit,
};
