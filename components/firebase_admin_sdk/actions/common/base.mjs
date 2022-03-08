import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  props: {
    firebase,
  },
  methods: {
    async deleteApp() {
      this.firebase.deleteApp();
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp();
      const response = await this.getResponse();
      this.emitSummary($, response);
      return response;
    } finally {
      await this.deleteApp();
    }
  },
};
