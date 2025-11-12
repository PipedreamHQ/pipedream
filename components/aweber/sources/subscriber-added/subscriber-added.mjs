import constants from "../../common/constants.mjs";
import common from "../common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "aweber-subscriber-added",
  name: "Subscriber Added",
  description: "Emit new event when a subscriber in a list is added. [See the docs here](https://api.aweber.com/#tag/Subscribers/paths/~1accounts~1{accountId}~1lists~1{listId}~1subscribers/get)",
  type: "source",
  version: "0.0.6",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.aweberApp.getSubscribersForAccount;
    },
    getResourceFnArgs(args) {
      return {
        ...args,
        accountId: this.accountId,
        params: {
          [constants.PAGINATION.OPTIONS_PROP]: "findSubscribers",
        },
      };
    },
    getSummary(resource) {
      return `Subscriber added ${resource.email}`;
    },
  },
  sampleEmit,
};
