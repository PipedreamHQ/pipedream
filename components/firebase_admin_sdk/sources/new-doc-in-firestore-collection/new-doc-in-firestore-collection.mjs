import common from "../common/common.mjs";

export default {
  ...common,
  key: "firebase_admin_sdk-new-doc-in-firestore-collection",
  name: "New Document in Firestore Collection",
  description: "Emit new event when a structured query returns new documents",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        common.props.firebase,
        "query",
      ],
    },
  },
  methods: {
    ...common.methods,
    async processEvent() {
      const structuredQuery = JSON.parse(this.query);

      const queryResults = await this.firebase.runQuery(structuredQuery);

      for (const result of queryResults) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
    },
    generateMeta({ document }) {
      const {
        name,
        createTime,
      } = document;
      const id = name.substring(name.lastIndexOf("/") + 1);
      return {
        id,
        summary: name,
        ts: Date.parse(createTime),
      };
    },
  },
};
