import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "detectify-new-high-risk-finding",
  name: "New High Risk Finding",
  description: "Emit new event when a severe security finding at high risk level is detected.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.detectify.listVulnerabilities;
    },
    getArgs(lastTs) {
      return {
        params: {
          "severity[]": "high",
          "asset_token[]": this.domainToken,
          "created_after": lastTs,
        },
      };
    },
    getResourceType() {
      return "vulnerabilities";
    },
    generateMeta(vulnerability) {
      return {
        id: vulnerability.uuid,
        summary: `New high risk finding: ${vulnerability.title}`,
        ts: Date.parse(this.getTs(vulnerability)),
      };
    },
  },
  sampleEmit,
};
