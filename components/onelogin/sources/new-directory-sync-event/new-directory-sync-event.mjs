import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onelogin-new-directory-sync-event",
  name: "New Directory Sync Event",
  description: "Emit new event when a directory sync event is triggered in OneLogin. [See the documentation](https://developers.onelogin.com/api-docs/1/events/get-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return 117;
    },
    getSummary(item) {
      return `Directory sync event: ${item.directory_sync_run_id}`;
    },
  },
  sampleEmit,
};
