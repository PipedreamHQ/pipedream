import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-update-database",
  name: "Update Database",
  description: "Update a database. [See the documentation](https://developers.notion.com/reference/update-a-database)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    databaseId: {
      propDefinition: [
        notion,
        "databaseId",
      ],
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of database as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the description of the database that is displayed in the Notion UI. If omitted, then the database description remains unchanged.",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The properties of a database to be changed in the request, in the form of a JSON object. If updating an existing property, then the keys are the names or IDs of the properties as they appear in Notion, and the values are [property schema objects](https://developers.notion.com/reference/rich-text). If adding a new property, then the key is the name of the new database property and the value is a [property schema object](https://developers.notion.com/reference/property-schema-object).",
      optional: true,
    },
  },
  async additionalProps(props) {
    if (this.databaseId) {
      const database = await this.notion.retrieveDatabase(this.databaseId);

      props.title.default = database.title.map((text) => text.text.content).join(" ");
      props.description.default = database.description.map((text) => text.plain_text).join(" ");
      props.properties.default = Object.entries(database.properties).reduce((acc, [
        key,
        value,
      ]) => {
        acc[key] = JSON.stringify(value);
        return acc;
      }, {});
      return {};
    }
  },
  async run({ $ }) {
    const response = await this.notion.updateDatabase({
      database_id: this.databaseId,
      title: [
        {
          text: {
            content: this.title,
          },
        },
      ],
      description: [
        {
          text: {
            content: this.description,
          },
        },
      ],
      properties: utils.parseObject(this.properties),
    });

    $.export("$summary", `Successfully updated database with ID ${response.id}`);
    return response;
  },
};
