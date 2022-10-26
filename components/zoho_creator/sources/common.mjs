import zohoCreator from "../zoho_creator.app.mjs";
import constants from "../common/constants.mjs";

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
    getLastTimestamp() {
      return this.db.get(constants.LAST_TIMESTAMP);
    },
    setLastTimestamp(timestamp) {
      return this.db.set(constants.LAST_TIMESTAMP, timestamp);
    },
  },
};
