import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";

export default {
  key: "notion-update-database",
  name: "Update Data Source",
  description:
    "Update a Notion database (data source): rename it, change its description, or add/rename/retype its columns."
    + " Provide the **data source ID** (use **Search** with `filter: data_source` to resolve a database name, or **Retrieve Database Schema** to inspect existing columns)."
    + " `properties` is a JSON object of changes: to **add** a column, use a new name → type (e.g. `{ \"Location\": \"rich_text\" }`); to **rename/retype** an existing column, key it by its current name/ID."
    + " Each value is a [property schema object](https://developers.notion.com/reference/property-schema-object) or a shorthand type name."
    + " [See the documentation](https://developers.notion.com/reference/update-a-data-source)",
  version: "2.0.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    dataSourceId: {
      type: "string",
      label: "Data Source ID",
      description: "The ID of the database's data source. Use **Search** (`filter: data_source`) or **Retrieve Database Schema** to find it.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "A new title for the data source. If omitted, the title is unchanged.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A new description for the data source. If omitted, the description is unchanged.",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "JSON object of column changes. To add a column: `{ \"Location\": \"rich_text\" }`. To rename/retype: key by the current column name. Example: `{ \"Priority\": { \"select\": { \"options\": [ { \"name\": \"High\" } ] } } }`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      data_source_id: utils.extractNotionId(this.dataSourceId),
    };
    if (this.title) {
      payload.title = [
        {
          text: {
            content: this.title,
          },
        },
      ];
    }
    if (this.description) {
      payload.description = [
        {
          text: {
            content: this.description,
          },
        },
      ];
    }
    if (this.properties) {
      payload.properties = utils.normalizeDatabaseSchema(this.properties);
    }

    const response = await this.notion.updateDataSource(payload);

    $.export("$summary", `Successfully updated data source with ID ${response.id}`);
    return response;
  },
};
