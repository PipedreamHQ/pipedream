import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "pipedrive-updated-deal",
  name: "Updated Deal (Instant)",
  description: "Emit new event when a deal is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipedriveApp.getDeals;
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
      return constants.EVENT_OBJECT.DEAL;
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
