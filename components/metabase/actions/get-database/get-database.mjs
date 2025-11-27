import app from "../../metabase.app.mjs";

export default {
  key: "metabase-get-database",
  name: "Get Database",
  description: "Retrieve database information. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apidatabase/get/api/database/{id}).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    databaseId: {
      propDefinition: [
        app,
        "databaseId",
      ],
    },
    include: {
      type: "string",
      label: "Include",
      description: "What to include in the response",
      options: [
        "tables",
        "tables.fields",
      ],
      optional: true,
    },
    includeEditableDataModel: {
      type: "boolean",
      label: "Include Editable Data Model",
      description: "Whether to include editable data model information",
      optional: true,
    },
    excludeUneditableDetails: {
      type: "boolean",
      label: "Exclude Uneditable Details",
      description: "Whether to exclude uneditable details from the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      databaseId,
      include,
      includeEditableDataModel,
      excludeUneditableDetails,
    } = this;

    const response = await app.getDatabase({
      $,
      databaseId,
      params: {
        include,
        include_editable_data_model: includeEditableDataModel,
        exclude_uneditable_details: excludeUneditableDetails,
      },
    });

    $.export("$summary", `Successfully retrieved database with ID \`${response?.id}\``);

    return response;
  },
};
