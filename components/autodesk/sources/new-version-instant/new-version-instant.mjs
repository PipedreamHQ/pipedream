import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "autodesk-new-version-instant",
  name: "New File Version Created (Instant)",
  description: "Emit new event when a new version of a file is created in Autodesk. [See the documentation](https://aps.autodesk.com/en/docs/webhooks/v1/reference/http/webhooks/systems-system-events-event-hooks-POST/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "dm.version.added";
    },
    generateMeta(payload) {
      return {
        id: payload.source,
        summary: `New File Version for File: ${payload.name}`,
        ts: Date.parse(payload.createdTime),
      };
    },
  },
  sampleEmit,
};
