import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "pipedrive-new-person",
  name: "New Person (Instant)",
  description: "Emit new event when a new person is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipedriveApp.getPersons;
    },
    getResourceFnArgs() {
      return {
        sort: "add_time DESC, id DESC",
      };
    },
    getResourceProperty() {
      return "add_time";
    },
    getEventObject() {
      return constants.EVENT_OBJECT.PERSON;
    },
    getEventAction() {
      return constants.EVENT_ACTION.ADDED;
    },
    getTimestamp(resource) {
      return Date.parse(resource.add_time);
    },
  },
};
