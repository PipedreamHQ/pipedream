import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "pipedrive-updated-person",
  name: "Updated Person (Instant)",
  description: "Emit new event when a person is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipedriveApp.getPersons;
    },
    getResourceFnArgs() {
      return {
        sort: "update_time DESC, id DESC",
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
