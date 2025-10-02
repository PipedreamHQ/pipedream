import app from "../../qdrant.app.mjs";
import utils from "../../common/utils.mjs";
import { QdrantClient } from "@qdrant/js-client-rest";

export default {
  key: "qdrant-get-points",
  name: "Get Points",
  description: "Get points by IDs from a collection.",
  type: "action",
  version: "0.0.2",
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
    ids: {
      type: "string[]",
      label: "Point IDs",
      description: "The IDs of the points. E.g. `[\"94058ad0-c3c0-4bd9-a085-b7e45f009070\", 32342]`",
      propDefinition: [
        app,
        "pointId",
      ],
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
    async getPoints(collectionName, {
      ids, withPayload, withVector,
    }) {
      const client = new QdrantClient(this.app.getCredentials());

      return await client.retrieve(collectionName, {
        ids,
        with_payload: withPayload,
        with_vector: withVector,
      });
    },
  },
  async run({ $: step }) {
    const {
      collectionName, ids, withPayload, withVector, getPoints,
    } = this;

    const response = await getPoints(
      collectionName,
      {
        ids: utils.parsePointIds(ids),
        withPayload,
        withVector,
      },
    );

    step.export("$summary", "Successfully retrieved points");

    return response;
  },
};
