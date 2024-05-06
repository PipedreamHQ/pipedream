import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "teamioo-new-group-bookmark-url",
  name: "New Group Bookmark URL",
  description: "Emit new event when a new URL is bookmarked in a group.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.teamioo.listBookmarks;
    },
    getSummary(item) {
      return `New group bookmark URL created with Id: ${item._id}`;
    },
  },
  sampleEmit,
};
