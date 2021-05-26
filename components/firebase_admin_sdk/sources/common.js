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
  hooks: {
    async activate() {
      await this.firebase.initializeApp();
    },
    async deactivate() {
      await this.firebase.deleteApp();
    },
  },
};