import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "pipedrive-updated-person",
  name: "Updated Person",
  description: "Triggers when a person is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipedriveApp.getPersons;
    },
    getResourceFnArgs() {
      return {
        sort: "update_time DESC",
      };
    },
    getResourceProperty() {
      return "update_time";
    },
    getEventObject() {
      return constants.EVENT_OBJECT.PERSON;
    },
    getEventAction() {
      return constants.EVENT_ACTION.UPDATED;
    },
    getMetaId(resource) {
      return this.getTimestamp(resource);
    },
    getTimestamp(resource) {
      return Date.parse(resource.update_time);
    },
  },
};
