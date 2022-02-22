import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  key: "firebase_admin_sdk-create-documents",
  name: "Create Documents",
  description: "Creates a New Document",
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
    data: {
      propDefinition: [
        firebase,
        "data",
      ],
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp();
      const firebase = this.firebase.getApp();
      const collection = await firebase.firestore().collection(this.collection);
      const doc = await collection.add(this.data);
      $.export("$summary", `Successfully added document with name: ${doc._path.segments[1]}`);

    } catch (err) {
      throw new Error(err);
    } finally {
      this.firebase.deleteApp();
    }
  },
};
