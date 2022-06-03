import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";
const buildPropertyProps = utils.buildPropertyProps;
import constants from "../common/constants.mjs";

export default {
  key: "notion-create-page",
  name: "Create a Page",
  description: "Creates a page. [See the docs](https://developers.notion.com/reference/post-page)",
  version: "0.0.2",
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
    paragraph: constants.BLOCK_TYPES.paragraph.prop,
    todo: constants.BLOCK_TYPES.to_do.prop,
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
    if (this.paragraph) {
      additionalProps = {
        ...additionalProps,
        ...constants.BLOCK_TYPES.paragraph.additionalProps,
      };
    }
    if (this.todo) {
      additionalProps = {
        ...additionalProps,
        ...constants.BLOCK_TYPES.to_do.additionalProps,
      };
    }
    if (this.parentId) {
      const propertyProps = await this.buildPropertyProps(this.parentId);
      additionalProps = {
        ...additionalProps,
        ...propertyProps,
      };
      if (!additionalProps.title) {
        additionalProps.title = {
          type: "string",
          label: "Title",
          description: "The type of this property is `title`. [See title type docs here](https://developers.notion.com/reference/property-object#title-configuration) E.g. `New Beauty Title`",
        };
      }
      additionalProps.title.optional = false;
    }
    return additionalProps;
  },
  methods: {
    buildPropertyProps,
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
