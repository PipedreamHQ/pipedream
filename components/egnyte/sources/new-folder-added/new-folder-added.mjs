import common from "../common/base.mjs";

export default {
  ...common,
  key: "egnyte-new-folder-added",
  name: "New Folder (Instant)",
  description: "Emit new event when a folder is added to the specified folder(s) in Egnyte. [See the documentation](https://storage.googleapis.com/pint-internal-static-hosting/connectWebhooks/index.html#operation/registerWebhook).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "fs:add_folder";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: "New Folder Added",
        ts: event.timestamp,
      };
    },
  },
};
