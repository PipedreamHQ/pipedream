import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  key: "firebase_admin_sdk-list-documents",
  name: "List Documents",
  description: "Lists documents in a collection",
  version: "0.0.1",
  type: "action",
  props: {
    firebase,
    collection: {
      propDefinition: [
        firebase,
        "collection",
      ],
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp();
      const firebase = this.firebase.getApp();
      const snapshot = await firebase.firestore().collection(this.collection)
        .listDocuments();
      const res = snapshot.map((doc) => doc._path.segments[1]);
      $.export("$summary", `Successfully retrieved ${res.length} document(s)`);

    } catch (err) {
      throw new Error(err);
    } finally {
      this.firebase.deleteApp();
    }
  },
};
