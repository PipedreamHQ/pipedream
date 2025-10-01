import common from "../common/base.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-list-documents",
  name: "List Documents",
  description: "Lists documents in a collection. [See the docs here](https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#listDocuments)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    maxResults: {
      propDefinition: [
        common.props.firebase,
        "maxResults",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResponse() {
      return this.firebase.listDocuments(this.collection, this.maxResults);
    },
    emitSummary($, response) {
      $.export("$summary", `Successfully retrieved ${response.length} document(s)`);
    },
  },
};
