import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence_data_center-blogpost-updated",
  name: "Blogpost Updated (Instant)",
  description: "Emit new event when a blogpost is updated in Confluence Data Center.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "blog_updated",
      ];
    },
  },
  sampleEmit,
};
