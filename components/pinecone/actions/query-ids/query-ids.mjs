import app from "../../pinecone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pinecone-query-ids",
  name: "Query IDs",
  description: "Searches a namespace, using a query vector. It retrieves the ids of the most similar items in a namespace, along with their similarity scores. [See the documentation](https://docs.pinecone.io/reference/api/data-plane/query).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
      description: "The filter to apply. You can use vector metadata to limit your search. For guidance and examples, see [filtering-with-metadata](https://docs.pinecone.io/guides/data/filtering-with-metadata).",
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
      ],
    },
    vector: {
      description: `${app.propDefinitions.vectorValues.description} Each request can contain only one of the parameters either **Vector Values** or **Vector ID**.`,
      propDefinition: [
        app,
        "vectorValues",
      ],
    },
  },
  methods: {
    query(args = {}) {
      return this.app.post({
        path: "/query",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      query,
      indexName,
      id,
      vector,
      topK,
      filter,
      includeValues,
      includeMetadata,
      namespace,
    } = this;

    const vectorParsed = utils.parseArray(vector);

    const response = await query({
      step,
      indexName,
      data: {
        id,
        ...(vectorParsed.length && {
          vector: vectorParsed,
        }),
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
