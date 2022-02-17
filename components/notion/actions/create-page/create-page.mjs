import notion from "../../notion.app.mjs";
import common from "../common.mjs";

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
    paragraph: common.blockType.paragraph.prop,
    todo: common.blockType.to_do.prop,
    // blockType: {
    //   propDefinition: [
    //     notion,
    //     "blockType",
    //   ],
    // },
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
    if (this.paragraph) {
      props = {
        ...props,
        ...common.blockType.paragraph.additionalProps,
      };
    }
    if (this.todo) {
      props = {
        ...props,
        ...common.blockType.to_do.additionalProps,
      };
    }
    // if (this.blockType) {
    //   props = {
    //     ...props,
    //     ...common.blockType[this.blockType].additionalProps,
    //   };
    // }
    return props;
  },
  methods: {
    buildBlockArgs(blockType) {
      switch (blockType) {
      case common.blockType.paragraph.key:
        return [
          {
            label: "text",
            value: this.paragraphText,
          },
        ];
      case common.blockType.to_do.key:
        return [
          {
            label: "text",
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
          title: common.buildTextProperty(this.title),
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
      page.children.push(common.buildBlock(
        common.blockType.paragraph.key,
        this.buildBlockArgs(common.blockType.paragraph.key),
      ));
    }

    if (this.todo) {
      page.children.push(common.buildBlock(
        common.blockType.to_do.key,
        this.buildBlockArgs(common.blockType.to_do.key),
      ));
    }

    // if (this.blockType) {
    //   page.children.push(common.buildBlock(
    //     this.blockType,
    //     this.buildBlockArgs(this.blockType),
    //   ));
    // }

    let response = await this.notion.createPage(page);
    $.export("$summary", "Created page succesfully");
    return response;
  },
};
