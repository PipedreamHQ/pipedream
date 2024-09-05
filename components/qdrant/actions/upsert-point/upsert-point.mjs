import app from "../../qdrant.app.mjs";
import utils from "../../common/utils.mjs";
import { QdrantClient } from "@qdrant/js-client-rest";

export default {
  key: "qdrant-upsert-point",
  name: "Upsert Point",
  description: "Adds a point to the Qdrant collection.",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    collectionName: {
      propDefinition: [
        app,
        "collectionName",
      ],
    },
    id: {
      propDefinition: [
        app,
        "pointId",
      ],
    },
    vector: {
      optional: false,
      propDefinition: [
        app,
        "vector",
      ],
    },
    payload: {
      propDefinition: [
        app,
        "payload",
      ],
    },
  },
  methods: {
    upsertPoint(collectionName, {
      id, vector, payload,
    }) {

      const client = new QdrantClient(this.app.getCredentials());

      return client.upsert(collectionName, {
        points: [
          {
            id,
            vector,
            payload,
          },
        ],
      });

    },
  },
  async run({ $: step }) {
    const {
      collectionName, id, vector, payload, upsertPoint,
    } = this;

    const response = await upsertPoint(collectionName, {
      id: utils.parsePointId(id),
      vector: utils.parseVector(vector),
      payload: utils.parse(payload),
    });

    step.export("$summary", "Successfully added the point");

    return response;
  },
};
