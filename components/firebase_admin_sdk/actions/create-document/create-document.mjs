import common from "../common/base.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-create-documents",
  name: "Create Documents",
  description: "Creates a New Document. [See the docs here](https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#add)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    collection: {
      propDefinition: [
        common.props.firebase,
        "collection",
      ],
    },
    data: {
      propDefinition: [
        common.props.firebase,
        "data",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResponse() {
      return await this.firebase.createDocument(this.collection, this.data);
    },
    emitSummary($, response) {
      $.export("$summary", `Successfully added document ${response._path.segments[1]}`);
    },
  },
};
