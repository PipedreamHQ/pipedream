import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "autodesk-new-folder-instant",
  name: "New Folder Created (Instant)",
  description: "Emit new event when a folder is added to a specified folder in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/webhooks/v1/reference/http/webhooks/systems-system-events-event-hooks-POST/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "dm.folder.added";
    },
    generateMeta(payload) {
      return {
        id: payload.source,
        summary: `New Folder Created: ${payload.name}`,
        ts: Date.parse(payload.createdTime),
      };
    },
  },
  sampleEmit,
};
