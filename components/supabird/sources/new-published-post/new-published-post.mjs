import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "supabird-new-published-post",
  name: "New Published Post",
  description: "Emit new event when a post published through SupaBird goes live. The event includes the public URL on each network. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listPublishedPosts;
    },
    getTimestamp(item) {
      return utils.toTimestamp(item.posted_at ?? item.created_at);
    },
    getSummary(item) {
      return `New published post: ${utils.truncate(item.text)}`;
    },
  },
  sampleEmit,
};
