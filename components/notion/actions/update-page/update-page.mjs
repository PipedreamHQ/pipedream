import notion from "../../notion.app.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "notion-update-page",
  name: "Update Page",
  description: "Updates page property values for the specified page. Properties that are not set via the properties parameter will remain unchanged. [See the docs](https://developers.notion.com/reference/patch-page)",
  version: "0.1.0",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      reloadProps: true,
    },
    iconType: {
      propDefinition: [
        notion,
        "iconType",
      ],
    },
    coverType: {
      propDefinition: [
        notion,
        "coverType",
      ],
    },
    archive: {
      type: "boolean",
      label: "Archive page",
      description: "Set to true to archive (delete) a page. Set to false to un-archive (restore) a page.",
      optional: true,
    },
  },
  async additionalProps() {
    let additionalProps = {};

    if (this.iconType) {
      additionalProps.iconValue = {
        type: "string",
        label: "Icon Value",
        description: "Icon value as an [emoji](https://developers.notion.com/reference/emoji-object)",
      };
    }
    if (this.coverType) {
      additionalProps.coverValue = {
        type: "string",
        label: "Cover Value",
        description: "Cover value as an [External URL](https://developers.notion.com/reference/file-object#external-file-objects)",
      };
    }

    if (this.pageId) {
      const { properties } = await this.notion.retrievePage(this.pageId);

      for (const propertyName in properties) {
        const property = properties[propertyName];

        if (!constants.NOTION_PROPERTIES[property.type]) continue;

        const {
          type,
          example,
        } = constants.NOTION_PROPERTIES[property.type];

        const prop = {
          label: propertyName,
          description: `The type of this property is \`${property.type}\`. [See ${property.type} type docs here](https://developers.notion.com/reference/property-object#${property.type}-configuration) ` + (example
            ? (" E.g. " + `\`${example}\``)
            : ""),
          type: type,
          optional: true,
        };

        additionalProps[propertyName] = prop;
      }
    }

    return additionalProps;
  },
  async run({ $ }) {
    const { properties } = await this.notion.retrievePage(this.pageId);

    const params = {
      properties: {},
      archived: this.archive || undefined,
    };

    for (const propertyName in properties) {
      const property = properties[propertyName];

      const value = utils.emptyStrToUndefined(this[propertyName]);

      if (value !== undefined) {
        params.properties[propertyName] = utils.formatPropertyToProp(value, property.type);
      }
    }

    if (this.iconType) {
      params.icon = {
        type: this.iconType,
        [this.iconType]: this.iconValue,
      };
    }

    if (this.coverType) {
      params.cover = {
        type: this.coverType,
        [this.coverType]: {
          url: this.coverValue,
        },
      };
    }

    const response = await this.notion.updatePage(this.pageId, params);

    $.export("$summary", "Updated page successfully");

    return response;
  },
};
