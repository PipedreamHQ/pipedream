import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-delete-block",
  name: "Delete Block",
  description: "Sets a Block object, including page blocks, to archived: true using the ID specified. [See the documentation](https://developers.notion.com/reference/delete-a-block)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "**Note:** In the Notion UI application, this moves the block to the \"Trash\" where it can still be accessed and restored.",
    },
    blockId: {
      type: "string",
      label: "Block ID",
      description: "Block ID retrieved from the **Retrieve Page Content** action",
    },
  },
  async run({ $ }) {
    const response = await this.notion.deleteBlock(this.blockId);
    $.export("$summary", `Successfully deleted block with ID ${this.blockId}`);
    return response;
  },
};
