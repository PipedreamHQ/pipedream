import app from "../../pinecone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pinecone-upsert-vector",
  name: "Upsert Vector",
  description: "Writes vectors into a namespace. If a new value is upserted for an existing vector ID, it will overwrite the previous value. [See the docs](https://docs.pinecone.io/reference/upsert).",
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
    id: {
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
    values: {
      propDefinition: [
        app,
        "vectorValues",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "vectorMetadata",
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
    upsertVector(args = {}) {
      return this.app.create({
        path: "/vectors/upsert",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      indexName,
      projectId,
      id,
      values,
      metadata,
      namespace,
    } = this;

    const response = await this.upsertVector({
      projectId,
      indexName,
      data: {
        vectors: [
          {
            id,
            values,
            metadata: utils.parse(metadata),
          },
        ],
        namespace,
      },
    });

    step.export("$summary", `Successfully upserted ${response.upsertedCount} vector(s).`);

    return response;
  },
};
