import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "passcreator-new-pass-scanned",
  name: "New Pass Scanned (Instant)",
  description: "Emits a new event when a new app scan has been recorded in Passcreator. [See the documentation](https://developer.passcreator.com/space/API/23331116/Subscription+endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvent() {
      return "app_scan_created";
    },
    generateMeta(scan) {
      return {
        id: scan.appScanId,
        summary: `New scan ${scan.appScanId} recorded`,
        ts: Date.parse(scan.createdOn),
      };
    },
  },
  sampleEmit,
};
