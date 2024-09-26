import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

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
    getParams(lastCreated) {
      return {
        include: [
          "unit",
          "owner",
          "agreementUrl",
          "customFields",
        ],
        updatedAfter: lastCreated,
      };
    },
    generateMeta(unitRental) {
      return {
        id: unitRental.id,
        summary: `New Unit Rental Created: ${unitRental.id}`,
        ts: Date.parse(unitRental.created),
      };
    },
  },
  sampleEmit,
};
