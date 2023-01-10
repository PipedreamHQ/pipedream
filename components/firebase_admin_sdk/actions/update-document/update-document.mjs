import common from "../common/base.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-update-document",
  name: "Update Documents",
  description: "Updates a Document. [See the docs here](https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    collection: {
      propDefinition: [
        common.props.firebase,
        "collection",
        (c) => ({
          region: c.databaseRegion,
        }),
      ],
    },
    document: {
      propDefinition: [
        common.props.firebase,
        "document",
        (c) => ({
          collection: c.collection,
          region: c.databaseRegion,
        }),
      ],
    },
    data: {
      propDefinition: [
        common.props.firebase,
        "data",
      ],
      description: "An object containing the fields and values with which to update the document",
    },
  },
  methods: {
    ...common.methods,
    async getResponse() {
      return this.firebase.updateDocument(this.collection, this.document, this.data);
    },
    emitSummary($) {
      $.export("$summary", `Successfully updated document ${this.document}`);
    },
  },
};
