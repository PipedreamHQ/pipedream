import notion from "../../notion.app.mjs";

export default {
  key: "notion-update-page",
  name: "Update Page",
  description: "Updates page property values for the specified page. Properties that are not set via the properties parameter will remain unchanged. [See the docs](https://developers.notion.com/reference/patch-page)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    pageId: {
      propDefinition: [
        notion,
        "pageId",
      ],
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
    properties: {
      type: "object",
      label: "Properties",
      description: "Property values to update for this page. The keys are the names or IDs of the property and the values are property values",
      optional: true,
      default: {},
    },
  },
  async additionalProps() {
    let props = {};
    if (this.iconType) {
      props = {
        ...props,
        iconValue: {
          type: "string",
          label: "Icon Value",
          description: "Icon value string",
        },
      };
    }
    if (this.coverType) {
      props = {
        ...props,
        iconValue: {
          type: "string",
          label: "Cover Value",
          description: "Cover value string",
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      properties: {
        ...this.properties,
      },
      archived: this.archive || undefined,
    };

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
    $.export("$summary", "Updated page succesfully");
    return response;
  },
};
