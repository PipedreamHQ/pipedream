import app from "../../mongodb.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mongodb-find-document",
  name: "Find Document",
  description: "Finds a document by a query filter. [See the documentation](https://docs.mongodb.com/manual/reference/method/db.collection.find/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "JSON string to use as a filter. Eg. `{ \"name\": \"Twitter\" }`",
    },
    options: {
      type: "string",
      label: "Options",
      description: "JSON string to use as options. Eg. `{ \"projection\": { \"_id\": 0, \"title\": 1 } }`",
      optional: true,
    },
  },
  methods: {
    async findDocument({
      database, collectionName, filter, options,
    } = {}) {
      const { app } = this;
      const client = await app.getClient();
      const collection = app.getCollection(client, database, collectionName);
      const result = await collection.findOne(filter, options);
      await client.close();
      return result;
    },
  },
  async run({ $ }) {
    const {
      findDocument,
      database,
      collectionName,
      filter,
      options,
    } = this;

    const response = await findDocument({
      database,
      collectionName,
      filter: utils.valueToObject(filter),
      options: utils.valueToObject(options),
    });

    if (!response) {
      $.export("$summary", "Document not found in the collection.");
      return;
    }

    $.export("$summary", "Successfully found a document in the collection.");
    return response;
  },
};
