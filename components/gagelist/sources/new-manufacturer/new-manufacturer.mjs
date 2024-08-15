import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gagelist-new-manufacturer",
  name: "New Manufacturer Created",
  description: "Emit new event when a new manufacturer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.gagelist.listManufacturers;
    },
    getTsField() {
      return "UpdatedDate";
    },
    getSummary(item) {
      return `New Manufacturer: ${item.Name}`;
    },
    async getResources(resourceFn, params) {
      const { data } = await resourceFn({
        params,
      });
      return data;
    },
  },
  sampleEmit,
};
