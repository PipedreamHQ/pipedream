import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dolibarr-new-thirdparty-created",
  name: "New Third Party Created",
  description: "Emit new event when a new third party is created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dolibarr.listThirdParties;
    },
    getSummary(item) {
      return `Third Party ID ${item.id} created`;
    },
  },
  sampleEmit,
};
