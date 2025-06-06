import app from "../../metabase.app.mjs";

export default {
  key: "metabase-get-database",
  name: "Get Database",
  description: "Retrieve database information and metadata. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apidatabase/GET/api/database/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    databaseId: {
      propDefinition: [
        app,
        "databaseId",
      ],
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include detailed metadata about tables and fields",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      databaseId, includeMetadata,
    } = this;

    let response = await this.app.getDatabase({
      $,
      databaseId,
    });

    if (includeMetadata) {
      response = await this.app._makeRequest({
        $,
        path: `/database/${databaseId}/metadata`,
      });
    }

    $.export("$summary", `Successfully retrieved database "${response.name}" information`);

    return response;
  },
};
