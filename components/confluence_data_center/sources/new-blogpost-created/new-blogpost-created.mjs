import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "confluence_data_center-new-blogpost-created",
  name: "New Blogpost Created (Instant)",
  description: "Emit new event when a new blogpost is created in Confluence Data Center.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "blog_created",
      ];
    },
  },
  sampleEmit,
};
