import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "cheddar-new-pricing-plan-created",
  name: "New Pricing Plan Created",
  description: "Emit new event when a new pricing plan is created. [See the documentation](https://docs.getcheddar.com/#pricing-plans)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: Product must containt at least one pricing plan to create source",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.cheddar.listPricingPlans;
    },
    getResourceType() {
      return "plan";
    },
    generateMeta(pricingPlan) {
      return {
        id: pricingPlan["@_id"],
        summary: `New Pricing Plan with ID ${pricingPlan["@_id"]}`,
        ts: Date.parse(pricingPlan.createdDatetime),
      };
    },
  },
};
