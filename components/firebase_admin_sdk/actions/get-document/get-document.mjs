import common from "../common/base.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-get-document",
  name: "Get Document",
  description: "Retrieves a document from a Firestore collection. [See the documentation](https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document)",
  version: "0.0.2",
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
  },
  methods: {
    ...common.methods,
    async getResponse() {
      const docRef = this.firebase.getDocument({
        collection: this.collection,
        document: this.document,
      });
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        return {
          exists: false,
          id: this.document,
        };
      }

      return {
        exists: true,
        id: snapshot.id,
        data: snapshot.data(),
        createTime: snapshot.createTime?.toDate(),
        updateTime: snapshot.updateTime?.toDate(),
        readTime: snapshot.readTime?.toDate(),
        ref: snapshot.ref.path,
      };
    },
    emitSummary($, response) {
      if (!response.exists) {
        $.export("$summary", `Document ${this.document} not found in collection ${this.collection}`);
        return;
      }
      $.export("$summary", `Successfully retrieved document ${this.document} from collection ${this.collection}`);
    },
  },
};
