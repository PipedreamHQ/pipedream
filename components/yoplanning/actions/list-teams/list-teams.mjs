import common from "../common/list.mjs";

export default {
  ...common,
  key: "yoplanning-list-teams",
  name: "List Teams",
  description: "Lists all teams. [See the documentation](https://yoplanning.pro/api/v3.1/swagger/)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listTeams;
    },
    getResourceFnArgs(step) {
      return {
        step,
      };
    },
    getSummaryArgs(count) {
      return [
        count,
        "team",
      ];
    },
  },
};
