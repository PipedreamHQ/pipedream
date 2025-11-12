import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "detectify-new-scan-started",
  name: "New Scan Started",
  description: "Emit new event as soon as a new security scan on the entered domain commences",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.detectify.listScanProfilesForAsset;
    },
    getArgs() {
      return {
        token: this.domainToken,
      };
    },
    getTs(profile) {
      return profile.latest_scan.started;
    },
    generateMeta(profile) {
      const started = this.getTs(profile);
      return {
        id: Date.parse(started),
        summary: `New scan started at ${started}`,
        ts: Date.parse(started),
      };
    },
  },
  sampleEmit,
};
