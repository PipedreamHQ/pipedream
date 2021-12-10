import zohoCreator from "../zoho_creator.app.mjs";
import constants from "../constants.mjs";

export default {
  props: {
    zohoCreator,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling interval",
      description: "How often to poll the Zoho Creator API for resources",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    appLinkName: {
      propDefinition: [
        zohoCreator,
        "appLinkName",
      ],
    },
  },
  methods: {
    getLastAddedTime() {
      return this.db.get(constants.LAST_ADDED_TIME);
    },
    setLastAddedTime(timestamp) {
      return this.db.set(constants.LAST_ADDED_TIME, timestamp);
    },
    getLastModifiedTime() {
      return this.db.get(constants.LAST_MODIFIED_TIME);
    },
    setLastModifiedTime(timestamp) {
      return this.db.set(constants.LAST_MODIFIED_TIME, timestamp);
    },
  },
};
