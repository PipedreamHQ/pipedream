import app from "../../qdrant.app.mjs";
import utils from "../../common/utils.mjs";
import { QdrantClient } from "@qdrant/js-client-rest";

export default {
  key: "qdrant-delete-points",
  name: "Delete Points",
  description: "Deletes one or more points by ID/filter in a Qdrant collection.",
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
    ids: {
      type: "string[]",
      label: "Point IDs",
      description: "The IDs of the points. E.g. `[\"94058ad0-c3c0-4bd9-a085-b7e45f009070\", 32342]`",
      propDefinition: [
        app,
        "pointId",
      ],
      optional: true,
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
    },
  },
  methods: {
    async deletePoints(collectionName, ids, filter) {
      const client = new QdrantClient(this.app.getCredentials());

      return await client.delete(collectionName, {
        points: ids,
        filter,
        wait: true,
      });
    },
  },
  async run({ $: step }) {
    const {
      collectionName, ids, filter,
    } = this;

    const response = await this.deletePoints(
      collectionName,
      utils.parsePointIds(ids),
      utils.parse(filter),
    );

    step.export("$summary", "Successfully deleted points");

    return response;
  },
};
