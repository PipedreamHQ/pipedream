import notion from "../../notion.app.mjs";
import utils from "../common/utils.mjs";
import constants from "../common/constants.mjs";

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
    blockType: {
      propDefinition: [
        notion,
        "blockType",
      ],
    },
  },
  async additionalProps() {
    return constants.BLOCK_TYPES[this.blockType].additionalProps;
  },
  methods: {
    buildBlockArgs(blockType) {
      switch (blockType) {
      case constants.BLOCK_TYPES.paragraph.key:
        return [
          {
            label: "text",
            value: this.paragraphText,
          },
        ];
      case constants.BLOCK_TYPES.to_do.key:
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
    const block = utils.buildBlock(
      this.blockType,
      this.buildBlockArgs(this.blockType),
    );
    const response = await this.notion.appendBlock(this.parentId, block);
    $.export("$summary", "Appended block(s) successfully");
    return response;
  },
};
