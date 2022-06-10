import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";
const buildPropertyProps = utils.buildPropertyProps;

export default {
  key: "notion-update-page",
  name: "Update Page",
  description: "Updates page property values for the specified page. Properties that are not set via the properties parameter will remain unchanged. [See the docs](https://developers.notion.com/reference/patch-page)",
  version: "0.1.1",
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
      reloadProps: true,
    },
    coverType: {
      propDefinition: [
        notion,
        "coverType",
      ],
      reloadProps: true,
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
      const propertyProps = await this.buildPropertyProps(this.pageId);
      additionalProps = {
        ...additionalProps,
        ...propertyProps,
      };
    }

    return additionalProps;
  },
  methods: {
    buildPropertyProps,
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
