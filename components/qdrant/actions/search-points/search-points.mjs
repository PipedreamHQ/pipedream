import app from "../../qdrant.app.mjs";
import utils from "../../common/utils.mjs";
import { QdrantClient } from "@qdrant/js-client-rest";

export default {
  key: "qdrant-search-points",
  name: "Search Points",
  description: "Performs a semantic search on the Qdrant collection.",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    collectionName: {
      propDefinition: [
        app,
        "collectionName",
      ],
    },
    vector: {
      optional: false,
      propDefinition: [
        app,
        "vector",
      ],
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
    },
    limit: {
      type: "integer",
      label: "Search Limit",
      description: "The maximum number of points to return.",
      optional: true,
      default: 10,
    },
    withPayload: {
      propDefinition: [
        app,
        "withPayload",
      ],
    },
    withVector: {
      propDefinition: [
        app,
        "withVector",
      ],
    },
  },
  methods: {
    searchPoints(collectionName, {
      vector, filter, limit, withPayload, withVector,
    }) {

      const client = new QdrantClient(this.app.getCredentials());

      return client.query(collectionName, {
        filter,
        limit,
        query: vector,
        with_payload: withPayload,
        with_vector: withVector,
      });

    },
  },
  async run({ $: step }) {
    const {
      collectionName, vector, filter, withPayload, withVector, limit, searchPoints,
    } = this;

    const response = await searchPoints(
      collectionName,
      {
        vector: utils.parseVector(vector),
        filter: utils.parse(filter),
        limit: parseInt(limit),
        withPayload,
        withVector,
      },
    );

    step.export("$summary", "Successfully searched the collection");

    return response.points;
  },
};
