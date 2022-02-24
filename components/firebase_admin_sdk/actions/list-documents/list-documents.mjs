import firebase from "../../firebase_admin_sdk.app.mjs";

export default {
  key: "firebase_admin_sdk-list-documents",
  name: "List Documents",
  description: "Lists documents in a collection. [See the docs here](https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#listDocuments)",
  //version: "0.0.1",
  version: "0.0.28",
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
    const res = await this.firebase.listDocuments(this.collection);
    $.export("$summary", `Successfully retrieved ${res.length} document(s)`);
    return res;
  },
};
