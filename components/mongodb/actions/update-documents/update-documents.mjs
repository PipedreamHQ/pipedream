import app from "../../mongodb.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mongodb-update-documents",
  name: "Update Documents",
  description: "Updates many documents by query filter. [See the documentation](https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateMany/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    filter: {
      type: "string",
      label: "Filter",
      description: "JSON string to use as a filter. Eg. `{ \"rated\": \"G\" }`",
    },
    data: {
      label: "Data To Update",
      type: "string",
      description: "JSON data to use as the update. Eg. `{ \"$set\": { \"rating\": \"Everyone\" } }`",
    },
  },
  methods: {
    async updateDocuments({
      database, collectionName, filter, data,
    } = {}) {
      const { app } = this;
      const client = await app.getClient();
      const collection = app.getCollection(client, database, collectionName);
      const result = await collection.updateMany(filter, data);
      await client.close();
      return result;
    },
  },
  async run({ $ }) {
    const {
      updateDocuments,
      database,
      collectionName,
      filter,
      data,
    } = this;

    const response = await updateDocuments({
      database,
      collectionName,
      filter: utils.valueToObject(filter),
      data: utils.valueToObject(data),
    });

    $.export("$summary", `Successfully updated \`${response.modifiedCount}\` document(s) in the collection.`);
    return response;
  },
};
