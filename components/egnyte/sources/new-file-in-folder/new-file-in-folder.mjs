import common from "../common/base.mjs";

export default {
  ...common,
  key: "egnyte-new-file-in-folder",
  name: "New File in Folder (Instant)",
  description: "Emit new event when a file is added to the specified folder(s) in Egnyte. [See the documentation](https://storage.googleapis.com/pint-internal-static-hosting/connectWebhooks/index.html#operation/registerWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "fs:add_file";
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: "New File Added",
        ts: event.timestamp,
      };
    },
  },
};
