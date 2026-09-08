import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-update",
  name: "Create an Update",
  description: "Post an update (a comment) on an item, or reply to an existing update. Use to add a note to an item's activity feed; this changes no column value — use **Update Column Values** for that. Set `Board ID`, `Item ID` and `Update Body`, and set `Parent Update ID` only when replying to an existing update rather than starting a new thread. Example: Update Body `Design approved, moving to build`. Returns the new update's ID as a string. Use **Get Board Items Page** to find an `Item ID`. [See the documentation](https://developer.monday.com/api-reference/reference/updates#create-an-update)",
  type: "action",
  ai: "optimized",
  version: "0.0.19",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monday,
    updateBody: {
      propDefinition: [
        monday,
        "updateBody",
      ],
    },
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    itemId: {
      optional: false,
      propDefinition: [
        monday,
        "itemId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
    },
    parentId: {
      label: "Parent Update ID",
      description: "The ID of an existing update to reply to. Omit to start a new update thread on the item rather than replying to one.",
      propDefinition: [
        monday,
        "updateId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createUpdate({
        updateBody: this.updateBody,
        itemId: +this.itemId,
        parentId: utils.toNumber(this.parentId),
      });

    if (errors) {
      throw new Error(`Failed to create update: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create update: ${errorMessage}`);
    }

    const { id: updateId } = data.create_update;

    $.export("$summary", `Successfully created a new update with ID: ${updateId}`);

    return updateId;
  },
};
