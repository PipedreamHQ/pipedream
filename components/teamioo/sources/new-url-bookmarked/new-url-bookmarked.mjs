import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "teamioo-new-url-bookmarked",
  name: "New URL Bookmarked",
  description: "Emit new event when a new URL is bookmarked.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.teamioo.listBookmarks;
    },
    getSummary(item) {
      return `New bookmark created with Id: ${item._id}`;
    },
  },
  sampleEmit,
};
