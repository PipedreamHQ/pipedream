import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "notion-create-page",
  name: "Create a Page",
  description: "Creates a page. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    parentId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent ID",
      description: "The identifier for a Notion parent page",
    },
    title: {
      propDefinition: [
        notion,
        "title",
      ],
      default: "Untitled",
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
    paragraph: constants.BLOCK_TYPES.paragraph.prop,
    todo: constants.BLOCK_TYPES.to_do.prop,
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
    if (this.paragraph) {
      props = {
        ...props,
        ...constants.BLOCK_TYPES.paragraph.additionalProps,
      };
    }
    if (this.todo) {
      props = {
        ...props,
        ...constants.BLOCK_TYPES.to_do.additionalProps,
      };
    }
    return props;
  },
  methods: {
    buildBlockArgs(blockType) {
      switch (blockType) {
      case constants.BLOCK_TYPES.paragraph.name:
        return [
          {
            label: "rich_text",
            value: this.paragraphText,
          },
        ];
      case constants.BLOCK_TYPES.to_do.name:
        return [
          {
            label: "rich_text",
            value: this.todoText,
          },
          {
            label: "checked",
            value: this.todoChecked,
          },
        ];
      default:
        throw new Error("This block type is not yet supported");
      }
    },
  },
  async run({ $ }) {
    const page = {
      parent: {
        page_id: this.parentId,
      },
      properties: {
        title: {
          title: utils.buildTextProperty(this.title),
        },
      },
      children: [],
    };

    if (this.iconType) {
      page.icon = {
        type: this.iconType,
        [this.iconType]: this.iconValue,
      };
    }

    if (this.coverType) {
      page.cover = {
        type: this.coverType,
        [this.coverType]: {
          url: this.coverValue,
        },
      };
    }

    if (this.paragraph) {
      page.children.push(utils.buildBlock(
        constants.BLOCK_TYPES.paragraph.name,
        this.buildBlockArgs(constants.BLOCK_TYPES.paragraph.name),
      ));
    }

    if (this.todo) {
      page.children.push(utils.buildBlock(
        constants.BLOCK_TYPES.to_do.name,
        this.buildBlockArgs(constants.BLOCK_TYPES.to_do.name),
      ));
    }

    const response = await this.notion.createPage(page);
    $.export("$summary", "Created page successfully");
    return response;
  },
};
