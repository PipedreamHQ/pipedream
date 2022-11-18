import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "pipedrive-new-deal",
  name: "New Deal",
  description: "Triggers when a new deal is created.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipedriveApp.getDeals;
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
      return constants.EVENT_OBJECT.DEAL;
    },
    getEventAction() {
      return constants.EVENT_ACTION.ADDED;
    },
    getTimestamp(resource) {
      return Date.parse(resource.add_time);
    },
  },
};
