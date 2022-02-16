import notion from "../../notion.app.mjs";
import common from "../../common.mjs";

export default {
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Creates and appends new children blocks to the parent *block_id* specified. [See the docs](https://developers.notion.com/reference/patch-block-children)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    parentId: {
      propDefinition: [
        notion,
        "pageId",
      ],
      label: "Parent Block ID",
      description: "The identifier for the parent block",
    },
    paragraph: common.blockType.paragraph.prop,
    todo: common.blockType.todo.prop,
  },
  async additionalProps() {
    let props = {};
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
    const blocks = [];

    if (this.paragraph) {
      blocks.push({
        object: "block",
        type: common.blockType.paragraph.key,
        [common.blockType.paragraph.key]: {
          text: this.notion.buildTextProperty(this.paragraphText),
        },
      });
    }

    if (this.todo) {
      blocks.push({
        object: "block",
        type: common.blockType.todo.key,
        [common.blockType.todo.key]: {
          text: this.notion.buildTextProperty(this.todoText),
          checked: this.todoChecked,
        },
      });
    }

    let response = await this.notion.appendBlock(this.parentId, blocks);
    $.export("$summary", "Appended block(s) successfully");
    return response;
  },
};
