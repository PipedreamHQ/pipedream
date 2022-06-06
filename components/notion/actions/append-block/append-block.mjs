import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "notion-append-block",
  name: "Append Block to Parent",
  description: "Creates and appends new children blocks to the parent *block_id* specified. [See the docs](https://developers.notion.com/reference/patch-block-children)",
  version: "0.0.2",
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
    blockTypes: {
      propDefinition: [
        notion,
        "blockTypes",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.blockTypes.reduce((props, blockType) => ({
      ...props,
      ...constants.BLOCK_TYPES[blockType].additionalProps,
    }), {});
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
    const blocks = this.blockTypes
      .map((block) => utils.buildBlock(block, this.buildBlockArgs(block)));
    const response = await this.notion.appendBlock(this.parentId, blocks);
    $.export("$summary", "Appended block(s) successfully");
    return response;
  },
};
