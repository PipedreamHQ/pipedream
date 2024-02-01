import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "white-swan-new-personal-plan",
  name: "New Personal Plan",
  description: "Emit new event when a customer creates a personal plan.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.whiteSwan.listPersonalPlans;
    },
    getItemKey(plan) {
      return plan.plan_id;
    },
    generateMeta(plan) {
      return {
        id: plan.plan_id,
        summary: `New Plan ${plan.plan_id}`,
        ts: Date.now(),
      };
    },
  },
};
