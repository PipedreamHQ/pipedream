import firebase from "../../firebase_admin_sdk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    firebase,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
    databaseRegion: {
      propDefinition: [
        firebase,
        "databaseRegion",
      ],
    },
  },
  methods: {
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    try {
      await this.firebase.initializeApp(this.databaseRegion);
      await this.processEvent(event);
    } catch (err) {
      console.log("CHECK HERE FOR ERROR: ", err.response);
      throw new Error(err);
    } finally {
      this.firebase.deleteApp();
    }
  },
};
