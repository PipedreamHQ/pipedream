import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "hana-new-report-group",
  name: "New Report Group",
  description: "Emit new event when a new report group is created. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#get-report-groups)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResults() {
      return this.hana.getPaginatedResults({
        fn: this.hana.searchReportGroups,
      });
    },
    generateMeta(group) {
      return {
        id: group._id,
        summary: `New report group: ${group.title}`,
        ts: Date.parse(group.createdAt),
      };
    },
  },
};
