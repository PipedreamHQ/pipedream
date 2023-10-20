import common from "../common/base.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-create-document",
  name: "Create Document",
  description: "Creates a New Document. [See the docs here](https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#add)",
  version: "0.0.6",
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
    data: {
      propDefinition: [
        common.props.firebase,
        "data",
      ],
    },
    customId: {
      label: "Custom ID",
      description: "Set this custom ID for the created document",
      type: "string",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getResponse() {
      return this.firebase.createDocument(this.collection, this.data, this.customId);
    },
    emitSummary($, response) {
      $.export("$summary", `Successfully added document ${response?._path?.segments[1] ?? ""}`);
    },
  },
};
