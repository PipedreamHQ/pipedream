import utils from "../../common/utils.mjs";
import app from "../../pinecone.app.mjs";

export default {
  key: "pinecone-fetch-vectors",
  name: "Fetch Vectors",
  description: "Looks up and returns vectors by ID, from a single namespace.. [See the docs](https://docs.pinecone.io/reference/fetch).",
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
  async run({ $: step }) {
    const {
      indexName,
      projectId,
      ids,
      namespace,
    } = this;

    const response = await this.app.fetchVectors({
      projectId,
      indexName,
      params: {
        ids: utils.parseArray(ids),
        namespace,
      },
    });

    step.export("$summary", `Successfully fetched ${Object.keys(response?.vectors).length} vectors.`);

    return response;
  },
};
