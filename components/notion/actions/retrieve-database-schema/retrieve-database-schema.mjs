import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "notion-retrieve-database-schema",
  name: "Retrieve Database Schema",
  description:
    "Get the column (property) schema of a Notion database (data source): each property's name, type, and — for `select`/`multi_select`/`status` columns — its allowed option values."
    + " **Call this before Query Data Source, Create Page, or Update Page on a database** so you use exact property names and valid option values."
    + " Provide the **data source ID** (use **Search** with `filter: data_source` to resolve a database name into its ID)."
    + " [See the documentation](https://developers.notion.com/reference/retrieve-a-data-source)",
  version: "1.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    notion,
    dataSourceId: {
      type: "string",
      label: "Data Source ID",
      description: "The ID of the database's data source. Use **Search** (`filter: data_source`) to resolve a database name into its ID.",
    },
  },
  async run({ $ }) {
    const dataSourceId = utils.extractNotionId(this.dataSourceId);
    const response = await this.notion.retrieveDataSource(dataSourceId);

    const schema = Object.entries(response.properties || {}).map(([
      name,
      property,
    ]) => {
      const entry = {
        name,
        type: property.type,
      };
      const options = property[property.type]?.options;
      if (Array.isArray(options)) {
        entry.options = options.map((option) => option.name);
      }
      return entry;
    });

    const title = this.notion.extractDataSourceTitle(response);
    $.export("$summary", `Retrieved schema for "${title}" (${schema.length} propert${schema.length === 1
      ? "y"
      : "ies"})`);

    return {
      dataSourceId,
      title,
      properties: schema,
    };
  },
};
