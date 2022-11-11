import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "pipedrive-new-deal",
  name: "New Deal (Instant)",
  description: "Emit new event when a new deal is created.",
  // version: "0.0.2",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getDeals;
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
