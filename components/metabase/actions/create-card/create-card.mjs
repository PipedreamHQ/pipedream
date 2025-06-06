import app from "../../metabase.app.mjs";
import { VISUALIZATION_TYPES } from "../../common/constants.mjs";

export default {
  key: "metabase-create-card",
  name: "Create Card",
  description: "Create a new question/card in Metabase. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apicard/POST/api/card/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the card",
    },
    databaseId: {
      propDefinition: [
        app,
        "databaseId",
      ],
    },
    query: {
      type: "object",
      label: "Query",
      description: "The query definition object. For native queries, use {\"native\": {\"query\": \"SELECT * FROM table\"}}. For structured queries, provide the query object.",
    },
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the card",
      optional: true,
    },
    visualizationType: {
      type: "string",
      label: "Visualization Type",
      description: "The type of visualization",
      options: VISUALIZATION_TYPES,
      default: "table",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      databaseId,
      query,
      collectionId,
      description,
      visualizationType,
    } = this;

    const data = {
      name,
      database_id: databaseId,
      dataset_query: {
        database: databaseId,
        ...query,
      },
      display: visualizationType || "table",
      visualization_settings: {},
    };

    if (collectionId !== undefined) {
      data.collection_id = collectionId;
    }

    if (description) {
      data.description = description;
    }

    const response = await this.app.createCard({
      $,
      data,
    });

    $.export("$summary", `Successfully created card "${name}" with ID ${response.id}`);

    return response;
  },
};
