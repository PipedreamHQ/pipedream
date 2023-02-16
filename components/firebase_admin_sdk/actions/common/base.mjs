import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  props: {
    firebase,
    databaseRegion: {
      propDefinition: [
        firebase,
        "databaseRegion",
      ],
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp(this.databaseRegion);
      const response = await this.getResponse();
      this.emitSummary($, response);
      return response;
    } finally {
      await this.firebase.deleteApp();
    }
  },
};
