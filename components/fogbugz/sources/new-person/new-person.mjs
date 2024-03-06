import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fogbugz-new-person",
  name: "New Person Created",
  description: "Emit new event when a new person or a user is created in FogBugz. It effectively tracks the addition of new users in the system.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getData() {
      return {
        cmd: "listPeople",
      };
    },
    getDataField() {
      return "people";
    },
    getIdField() {
      return "ixPerson";
    },
    getSummary(item) {
      return `New Person Created: ${item.sFullName} (${item.sEmail})`;
    },
  },
  sampleEmit,
};
