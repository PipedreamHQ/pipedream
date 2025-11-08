import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_dynamics_365_sales-new-opportunity-activity",
  name: "New Opportunity Activity",
  description: "Emit new event when a new task or activity is created for an opportunity.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    opportunityId: {
      propDefinition: [
        common.props.microsoftDynamics365Sales,
        "opportunityId",
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
          "$filter": `_regardingobjectid_value eq ${this.opportunityId}`,
        },
      };
    },
    getTsField() {
      return "createdon";
    },
    generateMeta(activity) {
      const ts = Date.parse(activity.createdon);
      return {
        id: `${activity.opportunityid}${ts}`,
        summary: `New Opportunity Activity: ${activity.subject}`,
        ts,
      };
    },
  },
};
