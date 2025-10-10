import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-update",
  name: "Create an Update",
  description: "Creates a new update. [See the documentation](https://developer.monday.com/api-reference/reference/updates#create-an-update)",
  type: "action",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
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
      description: "Select a parent update or provide an update ID",
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
