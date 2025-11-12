import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "detectify-new-medium-risk-finding",
  name: "New Medium Risk Finding",
  description: "Emit new event when a moderate security finding at a medium risk level is recognized.",
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
          "severity[]": "medium",
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
        summary: `New medium risk finding: ${vulnerability.title}`,
        ts: Date.parse(this.getTs(vulnerability)),
      };
    },
  },
  sampleEmit,
};
