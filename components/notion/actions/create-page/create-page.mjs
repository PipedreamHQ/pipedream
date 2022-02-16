import notion from "../../notion.app.mjs";
import common from "../../common.mjs";

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
    todo: common.blockType.todo.prop,
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
        ...common.blockType.todo.additionalProps,
      };
    }
    return props;
  },
  async run({ $ }) {
    const page = {
      parent: {
        page_id: this.parentId,
      },
      properties: {
        title: {
          title: this.notion.buildTextProperty(this.title),
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
      page.children.push({
        object: "block",
        type: common.blockType.paragraph.key,
        [common.blockType.paragraph.key]: {
          text: this.notion.buildTextProperty(this.paragraphText),
        },
      });
    }

    if (this.todo) {
      page.children.push({
        object: "block",
        type: common.blockType.todo.key,
        [common.blockType.todo.key]: {
          text: this.notion.buildTextProperty(this.todoText),
          checked: this.todoChecked,
        },
      });
    }

    let response = await this.notion.createPage(page);
    $.export("$summary", "Created page succesfully");
    return response;
  },
};
