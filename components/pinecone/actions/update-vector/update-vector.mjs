import utils from "../../common/utils.mjs";
import app from "../../pinecone.app.mjs";

export default {
  key: "pinecone-update-vector",
  name: "Update Vector",
  description: "Updates vector in a namespace. If a value is included, it will overwrite the previous value. [See the documentation](https://docs.pinecone.io/reference/api/data-plane/update).",
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
    updateVector(args = {}) {
      return this.app.post({
        path: "/vectors/update",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      updateVector,
      indexName,
      id,
      values,
      metadata,
      namespace,
    } = this;

    await updateVector({
      step,
      indexName,
      data: {
        id,
        values: utils.parseArray(values),
        setMetadata: utils.parse(metadata),
        namespace,
      },
    });

    step.export("$summary", `Successfully updated vector with ID ${id}.`);
    return {
      success: true,
    };
  },
};
