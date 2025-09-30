import utils from "../../common/utils.mjs";
import app from "../../pinecone.app.mjs";

export default {
  key: "pinecone-fetch-vectors",
  name: "Fetch Vectors",
  description: "Looks up and returns vectors by ID, from a single namespace.. [See the documentation](https://docs.pinecone.io/reference/api/data-plane/fetch).",
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
    fetchVectors(args = {}) {
      return this.app.makeRequest({
        path: "/vectors/fetch",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      fetchVectors,
      indexName,
      ids,
      namespace,
    } = this;

    const response = await fetchVectors({
      step,
      indexName,
      params: {
        ids: utils.parseArray(ids),
        namespace,
      },
    });

    step.export("$summary", `Successfully fetched \`${Object.keys(response.vectors).length}\` vector(s).`);

    return response;
  },
};
