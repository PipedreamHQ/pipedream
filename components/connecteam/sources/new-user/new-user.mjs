import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "connecteam-new-user",
  name: "New User Added",
  description: "Emit new event when a new user is added.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModelField() {
      return "users";
    },
    getModelFieldId() {
      return "userId";
    },
    getModelDateField() {
      return "createdAt";
    },
    getParams(lastDate) {
      return {
        createdAt: lastDate,
      };
    },
    getFunction() {
      return this.connecteam.listUsers;
    },
    getSummary(item) {
      return `New User: ${item.firstName} ${item.lastName}`;
    },
  },
  sampleEmit,
};
