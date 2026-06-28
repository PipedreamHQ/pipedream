import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";

export default {
  key: "notion-create-database",
  name: "Create Database",
  description:
    "Create a new Notion database (data source) as a subpage of a parent page, defining its column schema."
    + " Provide the parent page ID or URL (use **Search** to resolve a page name into an ID)."
    + " `properties` is a JSON object of column-name → column type. Each value is a [property schema object](https://developers.notion.com/reference/property-schema-object), or shorthand for simple types:"
    + " `{ \"Name\": \"title\", \"Quantity\": \"number\", \"Category\": { \"select\": { \"options\": [ { \"name\": \"A\" }, { \"name\": \"B\" } ] } } }`."
    + " Exactly one column must be the `title` type."
    + " [See the documentation](https://developers.notion.com/reference/database-create)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    parent: {
      type: "string",
      label: "Parent Page ID or URL",
      description: "The ID (or Notion URL) of the page the database will be created under. Use **Search** to resolve a page name into an ID.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the database as it appears in Notion.",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "JSON object of column-name → column type. Example: `{ \"Name\": \"title\", \"Quantity\": \"number\", \"Category\": { \"select\": { \"options\": [ { \"name\": \"A\" } ] } } }`. Exactly one column must be the `title` type.",
    },
  },
  async run({ $ }) {
    const properties = utils.normalizeDatabaseSchema(this.properties);

    const response = await this.notion.createDatabase({
      parent: {
        type: "page_id",
        page_id: utils.extractNotionId(this.parent),
      },
      title: [
        {
          type: "text",
          text: {
            content: this.title,
          },
        },
      ],
      initial_data_source: {
        properties,
      },
    });

    $.export("$summary", `Successfully created database "${this.title || "Untitled"}" (ID: ${response.id})`);
    return response;
  },
};
