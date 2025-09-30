import app from "../../pinecone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pinecone-upsert-vector",
  name: "Upsert Vector",
  description: "Writes vectors into a namespace. If a new value is upserted for an existing vector ID, it will overwrite the previous value. [See the documentation](https://docs.pinecone.io/reference/api/data-plane/upsert).",
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
    id: {
      propDefinition: [
        app,
        "vectorId",
      ],
    },
    values: {
      optional: false,
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
      return this.app.post({
        path: "/vectors/upsert",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      upsertVector,
      indexName,
      id,
      values,
      metadata,
      namespace,
    } = this;

    const response = await upsertVector({
      step,
      indexName,
      data: {
        vectors: [
          {
            id,
            values: utils.parseArray(values),
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
