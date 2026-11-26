import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "supabird-new-saved-idea",
  name: "New Saved Idea",
  description: "Emit new event when an idea is saved in SupaBird, for example by **Generate Post Ideas** or from the Ideas Lab in the app. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listSavedPosts;
    },
    getResourceParams() {
      return {
        source: "ideas_lab",
      };
    },
    getSummary(item) {
      return `New saved idea: ${utils.truncate(item.content)}`;
    },
  },
  sampleEmit,
};
