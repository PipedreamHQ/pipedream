import common from "../common/list.mjs";

export default {
  ...common,
  key: "yoplanning-list-clients",
  name: "List Clients",
  description: "Lists all clients. [See the documentation](https://yoplanning.pro/api/v3.1/swagger/)",
  type: "action",
  version: "0.0.3",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.app,
        "teamId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listClients;
    },
    getResourceFnArgs(step) {
      return {
        step,
        teamId: this.teamId,
      };
    },
    getSummaryArgs(count) {
      return [
        count,
        "client",
      ];
    },
  },
};
