import common from "../common/base.mjs";

export default {
  ...common,
  key: "planning_center-new-donation",
  name: "New Donation Received",
  description: "Emit new event when a donation is received. [See the documentation](https://developer.planning.center/docs/#/apps/giving/2019-10-18/vertices/donation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.planningCenter.listDonations;
    },
    getArgs() {
      return {
        params: {
          order: "-created_at",
        },
      };
    },
    getSummary(item) {
      return `New Donation with ID: ${item.id}`;
    },
  },
};
