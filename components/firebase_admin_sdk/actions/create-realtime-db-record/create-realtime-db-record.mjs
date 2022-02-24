import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  key: "firebase_admin_sdk-create-realtime-db-record",
  name: "Create Firebase Realtime Database Record",
  description: "Creates or replaces a child object within your Firebase Realtime Database. [See the docs here](https://firebase.google.com/docs/reference/js/database#update)",
  version: "0.0.1",
  type: "action",
  props: {
    firebase,
    path: {
      propDefinition: [
        firebase,
        "path",
      ],
    },
    data: {
      propDefinition: [
        firebase,
        "data",
      ],
      description: "Multiple property-value pairs that will be written to the Database together",
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp();
      const record = this.firebase.getApp().database()
        .ref(this.path);
      await record.update(this.data);
      $.export("$summary", "Successfully created record");
    } catch (err) {
      throw new Error(err);
    } finally {
      this.firebase.deleteApp();
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  },
};
