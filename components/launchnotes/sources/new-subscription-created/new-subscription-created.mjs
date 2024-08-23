import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "launchnotes-new-subscription-created",
  name: "New Subscription Created",
  description: "Emit new event when a new project subscription is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.launchnotes.listSubscriptions;
    },
    getDateField() {
      return "createdAt";
    },
    getTypes() {
      return "subscriptions";
    },
    getSummary(item) {
      return `New subscription created: ${item.id}`;
    },
    getRules(lastDate) {
      return [
        {
          field: this.getDateField(),
          expression: "gt",
          value: lastDate,
        },
      ];
    },
  },
  sampleEmit,
};
