import utils from "../../common/utils.mjs";
import app from "../../pinecone.app.mjs";

export default {
  key: "pinecone-update-vector",
  name: "Update Vector",
  description: "Updates vector in a namespace. If a value is included, it will overwrite the previous value. [See the docs](https://docs.pinecone.io/reference/update).",
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
    updateVector(args = {}) {
      return this.app.create({
        path: "/vectors/update",
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

    await this.updateVector({
      projectId,
      indexName,
      data: {
        id,
        values,
        setMetadata: utils.parse(metadata),
        namespace,
      },
    });

    step.export("$summary", `Successfully updated vector with ID ${id}.`);
  },
};
