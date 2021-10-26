const firebase = require("../firebase_admin_sdk.app.js");

module.exports = {
  props: {
    firebase,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
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
