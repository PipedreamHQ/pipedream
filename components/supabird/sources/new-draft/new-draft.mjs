import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "supabird-new-draft",
  name: "New Draft",
  description: "Emit new event when a draft is added to the SupaBird library. Unscheduling a post also moves it to Drafts. [See the documentation](https://api.supabird.io/v1/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listDrafts;
    },
    getSummary(item) {
      return `New draft: ${utils.truncate(item.content)}`;
    },
  },
  sampleEmit,
};
