import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "waitlist-new-list",
  name: "New List Created",
  description: "Emit new event each time a waitlist is created. [See the documentation](https://getwaitlist.com/docs/api-docs/waitlist)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.waitlist.listWaitlists;
    },
    getSummary(item) {
      return  `New waitlist with Id: ${item.id}`;
    },
    getField() {
      return "id";
    },
    getFilter(item, lastValue) {
      return item > lastValue;
    },
  },
  sampleEmit,
};
