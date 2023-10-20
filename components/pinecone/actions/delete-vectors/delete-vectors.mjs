import app from "../../pinecone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pinecone-delete-vectors",
  name: "Delete Vectors",
  description: "Deletes one or more vectors by ID, from a single namespace. [See the docs](https://docs.pinecone.io/reference/delete_post).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    indexName: {
      propDefinition: [
        app,
        "indexName",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    ids: {
      type: "string[]",
      label: "Vector IDs",
      description: "The IDs of the vectors. E.g. `[\"vec1\", \"vec2\"]`",
      propDefinition: [
        app,
        "vectorId",
        ({
          indexName, projectId,
        }) => ({
          indexName,
          projectId,
        }),
      ],
    },
    namespace: {
      propDefinition: [
        app,
        "namespace",
      ],
    },
  },
  methods: {
    deleteVector(args = {}) {
      return this.app.create({
        path: "/vectors/delete",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      indexName,
      projectId,
      ids,
      namespace,
    } = this;

    await this.deleteVector({
      projectId,
      indexName,
      data: {
        ids: utils.parseArray(ids),
        namespace,
      },
    });

    step.export("$summary", "Successfully deleted vectors");
  },
};
