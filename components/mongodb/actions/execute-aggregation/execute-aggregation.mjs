import app from "../../mongodb.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mongodb-execute-aggregation",
  name: "Execute Aggregation",
  description: "Execute an aggregation pipeline on a MongoDB collection. [See the documentation](https://www.mongodb.com/docs/drivers/node/current/fundamentals/aggregation/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    database: {
      propDefinition: [
        app,
        "database",
      ],
    },
    collectionName: {
      propDefinition: [
        app,
        "collection",
        ({ database }) => ({
          database,
        }),
      ],
    },
    pipeline: {
      type: "string[]",
      label: "Pipeline",
      description: "The aggregation pipeline to execute where each row represents a stage as a JSON string. Eg. `[ { \"$match\": { \"categories\": \"Bakery\" } }, { \"$group\": { \"_id\": \"$stars\", \"count\": { \"$sum\": 1 } } } ]`",
    },
  },
  methods: {
    async excecuteAggregation({
      database, collectionName, pipeline,
    } = {}) {
      const { app } = this;
      const client = await app.getClient();
      const collection = app.getCollection(client, database, collectionName);
      const cursor = collection.aggregate(pipeline);
      const result = await utils.iterate(cursor);
      await client.close();
      return result;
    },
  },
  async run({ $ }) {
    const {
      excecuteAggregation,
      database,
      collectionName,
      pipeline,
    } = this;

    const response = await excecuteAggregation({
      database,
      collectionName,
      pipeline: utils.parseArray(pipeline),
    });

    $.export("$summary", `Successfully executed aggregation pipeline on collection with \`${response.length}\` document(s).`);

    return response;
  },
};
