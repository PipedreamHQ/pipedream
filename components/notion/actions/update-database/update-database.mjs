import utils from "../../common/utils.mjs";
import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-update-database",
  name: "Update Data Source",
  description: "Update a data source. [See the documentation](https://developers.notion.com/reference/update-a-data-source)",
  version: "1.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    dataSourceId: {
      propDefinition: [
        notion,
        "dataSourceId",
      ],
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the data source as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the description of the data source that is displayed in the Notion UI. If omitted, then the data source description remains unchanged.",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "The properties of a data source to be changed in the request, in the form of a JSON object. If updating an existing property, then the keys are the names or IDs of the properties as they appear in Notion, and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object). If adding a new property, then the key is the name of the new data source property and the value is a [property schema object](https://developers.notion.com/reference/property-schema-object).",
      optional: true,
    },
  },
  async additionalProps(props) {
    if (this.dataSourceId) {
      const dataSource = await this.notion.retrieveDataSource(this.dataSourceId);

      props.title.default = dataSource.title.map((text) => text.text.content).join(" ");
      props.description.default = dataSource.description.map((text) => text.plain_text).join(" ");
      props.properties.default = Object.entries(dataSource.properties).reduce((acc, [
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
    const response = await this.notion.updateDataSource({
      data_source_id: this.dataSourceId,
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

    $.export("$summary", `Successfully updated data source with ID ${response.id}`);
    return response;
  },
};
