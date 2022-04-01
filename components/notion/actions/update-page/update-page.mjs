import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";

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
    title: {
      propDefinition: [
        notion,
        "title",
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
  },
  async additionalProps() {
    let props = {};
    if (this.iconType) {
      props = {
        ...props,
        iconValue: {
          type: "string",
          label: "Icon Value",
          description: "Icon value as an [emoji](https://developers.notion.com/reference/emoji-object)",
        },
      };
    }
    if (this.coverType) {
      props = {
        ...props,
        coverValue: {
          type: "string",
          label: "Cover Value",
          description: "Cover value as an [External URL](https://developers.notion.com/reference/file-object#external-file-objects)",
        },
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      properties: {},
      archived: this.archive || undefined,
    };

    if (this.title) {
      params.properties.title = {
        title: utils.buildTextProperty(this.title),
      };
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
