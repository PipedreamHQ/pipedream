import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-new-account-activity",
  name: "New Account Activity",
  description: "Emit new event when a new task or activity is created for an account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    accountId: {
      propDefinition: [
        common.props.microsoftDynamics365Sales,
        "accountId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoftDynamics365Sales.listActivityPointers;
    },
    getArgs() {
      return {
        params: {
          "$orderby": "createdon desc",
          "$filter": `_regardingobjectid_value eq ${this.accountId}`,
        },
      };
    },
    getTsField() {
      return "createdon";
    },
    generateMeta(activity) {
      const ts = Date.parse(activity.createdon);
      return {
        id: `${activity.accountid}${ts}`,
        summary: `New Account Activity: ${activity.subject}`,
        ts,
      };
    },
  },
};
