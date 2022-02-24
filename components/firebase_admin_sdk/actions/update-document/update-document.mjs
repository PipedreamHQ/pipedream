import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  key: "firebase_admin_sdk-update-documents",
  name: "Update Documents",
  description: "Updates a Document. [See the docs here](https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update)",
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
    document: {
      propDefinition: [
        firebase,
        "document",
        (c) => ({
          collection: c.collection,
        }),
      ],
    },
    data: {
      propDefinition: [
        firebase,
        "data",
      ],
      description: "An object containing the fields and values with which to update the document",
    },
  },
  async run({ $ }) {
    try {
      await this.firebase.initializeApp();
      const firebase = this.firebase.getApp();
      const doc = await firebase.firestore().collection(this.collection)
        .doc(this.document);
      await doc.update(this.data);
      $.export("$summary", `Successfully updated document ${this.document}`);
      return doc;
    } catch (err) {
      throw new Error(err);
    } finally {
      this.firebase.deleteApp();
    }
  },
};
