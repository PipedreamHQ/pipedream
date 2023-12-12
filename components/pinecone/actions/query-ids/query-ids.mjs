import app from "../../pinecone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pinecone-query-ids",
  name: "Query IDs",
  description: "Searches a namespace, using a query vector. It retrieves the ids of the most similar items in a namespace, along with their similarity scores. [See the docs](https://docs.pinecone.io/reference/query).",
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
    topK: {
      type: "integer",
      label: "Top K",
      description: "The number of results to return. E.g. `10`",
      min: 1,
      max: 10000,
      default: 10,
    },
    filter: {
      type: "object",
      label: "Filter",
      description: "The filter to apply. You can use vector metadata to limit your search. [See the docs](https://www.pinecone.io/docs/metadata-filtering/).",
      optional: true,
    },
    includeValues: {
      type: "boolean",
      label: "Include Values",
      description: "Whether to include the vector values in the response.",
      optional: true,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include the vector metadata in the response.",
      optional: true,
    },
    namespace: {
      propDefinition: [
        app,
        "namespace",
      ],
    },
    id: {
      optional: true,
      description: `${app.propDefinitions.vectorId.description} Each request can contain only one of the parameters either **Vector ID** or **Vector Values**.`,
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
    vector: {
      optional: true,
      description: `${app.propDefinitions.vectorValues.description} Each request can contain only one of the parameters either **Vector Values** or **Vector ID**.`,
      propDefinition: [
        app,
        "vectorValues",
      ],
    },
  },
  async run({ $: step }) {
    const {
      indexName,
      projectId,
      id,
      vector,
      topK,
      filter,
      includeValues,
      includeMetadata,
      namespace,
    } = this;

    const response = await this.app.query({
      projectId,
      indexName,
      data: {
        id,
        vector: utils.parseArray(vector),
        topK,
        filter: utils.parse(filter),
        includeValues,
        includeMetadata,
        namespace,
      },
    });

    step.export("$summary", `Successfully queried ${response.matches.length} matches.`);

    return response;
  },
};
