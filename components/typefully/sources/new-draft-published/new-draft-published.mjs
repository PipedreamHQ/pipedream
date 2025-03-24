import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "typefully-new-draft-published",
  name: "New Draft Published",
  description: "Emit new event when a draft is published to Twitter via Typefully.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.typefully.getRecentlyPublishedDrafts;
    },
    getSummary(draft) {
      return `Draft Published: ${draft.id}`;
    },
  },
  sampleEmit,
};
