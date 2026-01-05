import common from "../common/base-polling-no-pagination.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "simplero-new-list",
  name: "New List",
  description: "Emit new event when a new list is created. [See the documentation](https://github.com/Simplero/Simplero-API)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.simplero.getLists;
    },
    getSummary(item) {
      return `New List: ${item.name}`;
    },
  },
  sampleEmit,
};

