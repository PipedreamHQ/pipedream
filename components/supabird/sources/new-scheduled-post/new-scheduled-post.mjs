import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "supabird-new-scheduled-post",
  name: "New Scheduled Post",
  description: "Emit new event when a post is scheduled in SupaBird. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listScheduledPosts;
    },
    getSummary(item) {
      return `New scheduled post: ${utils.truncate(item.text)}`;
    },
  },
  sampleEmit,
};
