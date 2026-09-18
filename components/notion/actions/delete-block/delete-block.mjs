import notion from "../../notion.app.mjs";
import base from "../common/base-page-builder.mjs";

export default {
  ...base,
  key: "notion-delete-block",
  name: "Delete Block",
  description: "Sets a Block object, including page blocks, to archived: true using the ID specified. Example: blockId `\"1a2b3c4d-...\"` → archives that block and returns the block object with `archived: true`. [See the documentation](https://developers.notion.com/reference/delete-a-block)",
  version: "0.0.12",
  annotations: {
    // Notion's delete-a-block only archives (archived: true) — the block moves to
    // Trash and is restorable, so per the guideline this reversible archive is not
    // destructiveHint: true.
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    notion,
    infoLabel: {
      type: "alert",
      alertType: "info",
      content: "**Note:** In the Notion UI application, this moves the block to the \"Trash\" where it can still be accessed and restored.",
    },
    blockId: {
      propDefinition: [
        notion,
        "blockId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.deleteBlock(this.blockId);
    $.export("$summary", `Successfully deleted block with ID ${this.blockId}`);
    return response;
  },
};
