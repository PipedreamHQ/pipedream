import common from "../common/base.mjs";

export default {
  ...common,
  key: "storeganise-new-unit-rental-created",
  name: "New Unit Rental Created",
  description: "Emit new event when a unit rental is created in Storeganise",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.storeganise.listUnitRentals;
    },
    generateMeta(unitRental) {
      return {
        id: unitRental.id,
        summary: `New Unit Rental Created: ${unitRental.id}`,
        ts: Date.now(),
      };
    },
  },
};
