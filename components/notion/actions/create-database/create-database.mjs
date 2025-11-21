import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-database",
  name: "Create Database",
  description: "Create a database and its initial data source. [See the documentation](https://developers.notion.com/reference/database-create)",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    parent: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Page ID",
      description: "Select a parent page or provide a page ID",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of database as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text).",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object).",
    },
  },
  async run({ $ }) {
    const response = await this.notion.createDatabase({
      parent: {
        type: "page_id",
        page_id: this.parent,
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
        properties: utils.parseObject(this.properties),
      },
    });

    $.export("$summary", `Successfully created database with ID ${response.id}`);
    return response;
  },
};
