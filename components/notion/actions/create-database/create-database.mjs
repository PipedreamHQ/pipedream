import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-create-database",
  name: "Create Database",
  description: "Create a database and its initial data source. [See the documentation](https://developers.notion.com/reference/database-create)",
  version: "0.1.8",
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
    const parsedProperties = utils.parseObject(this.properties);
    const properties = parsedProperties && typeof parsedProperties === "object"
      ? Object.fromEntries(
        Object.entries(parsedProperties).map(([
          key,
          value,
        ]) => {
          if (typeof value === "string") {
            return [
              key,
              {
                [value]: {},
              },
            ];
          }
          // Normalize {type:"X"} objects missing their type-key: {type:"checkbox"} → {checkbox:{}}
          if (value && typeof value === "object" && "type" in value) {
            const typeKey = value.type;
            if (typeKey && typeof typeKey === "string" && !(typeKey in value)) {
              return [
                key,
                {
                  ...value,
                  [typeKey]: {},
                },
              ];
            }
          }
          return [
            key,
            value,
          ];
        }),
      )
      : parsedProperties;

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
        properties,
      },
    });

    $.export("$summary", `Successfully created database with ID ${response.id}`);
    return response;
  },
};
