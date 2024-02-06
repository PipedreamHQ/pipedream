import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-update",
  name: "Create an Update",
  description: "Creates a new update. [See the documentation](https://api.developer.monday.com/docs/updates-queries#create-an-update)",
  type: "action",
  version: "0.0.7",
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
      description: "The parent post identifier",
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
