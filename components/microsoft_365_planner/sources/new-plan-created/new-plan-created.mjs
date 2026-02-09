import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_365_planner-new-plan-created",
  name: "New Plan Created",
  description: "Emit new event when a new Plan is created in Microsoft 365 Planner",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    groupId: {
      propDefinition: [
        common.props.microsoft365Planner,
        "groupId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoft365Planner.listPlans;
    },
    getArgs() {
      return {
        groupId: this.groupId,
      };
    },
    generateMeta(plan) {
      return {
        id: plan.id,
        summary: plan.title,
        ts: Date.parse(plan.createdDateTime),
      };
    },
  },
};
