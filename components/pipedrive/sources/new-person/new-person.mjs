import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pipedrive-new-person",
  name: "New Person",
  description: "Triggers when a new person is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipedriveApp.getPersons;
    },
    getResourceFnArgs() {
      return {
        sort: "id DESC",
      };
    },
    getResourceProperty() {
      return "id";
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
