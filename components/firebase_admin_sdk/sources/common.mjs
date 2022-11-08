import firebase from "../firebase_admin_sdk.app.mjs";

export default {
  props: {
    firebase,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
  methods: {
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    try {
      await this.firebase.initializeApp();
      await this.processEvent(event);
    } catch (err) {
      console.log("CHECK HERE FOR ERROR: ", err.response);
      throw new Error(err);
    } finally {
      this.firebase.deleteApp();
    }
  },
};
