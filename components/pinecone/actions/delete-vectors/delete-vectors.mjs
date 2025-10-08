import app from "../../pinecone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pinecone-delete-vectors",
  name: "Delete Vectors",
  description: "Deletes one or more vectors by ID, from a single namespace. [See the documentation](https://docs.pinecone.io/reference/api/data-plane/delete).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    indexName: {
      propDefinition: [
        app,
        "indexName",
      ],
    },
    prefix: {
      propDefinition: [
        app,
        "prefix",
      ],
    },
    namespace: {
      propDefinition: [
        app,
        "namespace",
      ],
    },
    ids: {
      type: "string[]",
      label: "Vector IDs",
      description: "The IDs of the vectors. E.g. `[\"vec1\", \"vec2\"]`",
      propDefinition: [
        app,
        "vectorId",
      ],
    },
  },
  methods: {
    deleteVector(args = {}) {
      return this.app.post({
        path: "/vectors/delete",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      deleteVector,
      indexName,
      ids,
      namespace,
    } = this;

    await deleteVector({
      step,
      indexName,
      data: {
        ids: utils.parseArray(ids),
        namespace,
      },
    });

    step.export("$summary", "Successfully deleted vectors");
    return {
      success: true,
    };
  },
};
