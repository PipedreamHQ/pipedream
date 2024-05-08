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
  methods: {
    parseBooleanValues(data) {
      Object.entries(data).forEach(([
        key,
        value,
      ]) => {
        data[key] = value === "false"
          ? false
          : value === "true"
            ? true
            : value;
      });
      return data;
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
