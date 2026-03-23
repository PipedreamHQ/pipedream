import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tapfiliate-new-conversion",
  name: "New Conversion",
  description: "Emit new event when a new conversion is created. Conversion details are supplied by the application. [See the API docs](https://tapfiliate.com/docs/rest/#conversions-conversions-collection-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.tapfiliate.listConversions;
    },
    getSummary(item) {
      return `New Conversion: ${item.id}`;
    },
  },
  sampleEmit,
};
