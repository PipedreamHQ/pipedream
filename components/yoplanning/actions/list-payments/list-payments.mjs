import common from "../common/list.mjs";

export default {
  ...common,
  key: "yoplanning-list-payments",
  name: "List Payments",
  description: "Lists all payments. [See the documentation](https://yoplanning.pro/api/v3.1/swagger/)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    listPayments({
      teamId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/teams/${teamId}/payments/`,
        ...args,
      });
    },
    getResourceFn() {
      return this.listPayments;
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
        "payment",
      ];
    },
  },
};
