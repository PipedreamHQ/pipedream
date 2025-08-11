import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-update-block",
  name: "Update Child Block",
  description: "Updates a child block object. [See the documentation](https://developers.notion.com/reference/update-a-block)",
  version: "0.0.1",
  type: "action",
  props: {
    notion,
    blockId: {
      type: "string",
      label: "Block ID",
      description: "Block ID retrieved from the **Retrieve Page Content** action",
    },
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "**Note:** The update replaces the entire value for a given field. If a field is omitted (ex: omitting checked when updating a to_do block), the value will not be changed.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the block. [See the documentation](https://developers.notion.com/reference/block#block-type-object)",
    },
  },
  async run({ $ }) {
    const response = await this.notion.updateBlock({
      block_id: this.blockId,
      data: this.content,
    });
    $.export("$summary", `Successfully updated block with ID ${this.blockId}`);
    return response;
  },
};
