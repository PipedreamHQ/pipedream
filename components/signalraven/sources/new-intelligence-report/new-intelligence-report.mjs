import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "signalraven-new-intelligence-report",
  name: "New Intelligence Report",
  description: "Emit new event when a person or account research report is created. [See the documentation](https://signalraven.ai/developers/api)",
  type: "source",
  ai: "optimized",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    reportType: {
      type: "string",
      label: "Report Type",
      description: "Restrict to account or person reports.",
      optional: true,
      options: [
        "account",
        "person",
      ],
    },
  },
  methods: {
    ...common.methods,
    async fetchPage(offset) {
      const { data } = await this.app.listIntelligence({
        params: {
          type: this.reportType,
          limit: constants.MAX_LIMIT,
          offset,
        },
      });
      return data || [];
    },
    generateMeta(report) {
      return {
        id: report.id,
        summary: `New ${report.type} report: ${report.name || report.slug || report.id}`,
        ts: this.getTs(report),
      };
    },
  },
};
