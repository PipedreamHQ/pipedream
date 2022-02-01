import monday from "../../monday.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "monday-create-board",
  name: "Create Board",
  description: "Creates a new board. [See the docs here](https://api.developer.monday.com/docs/boards#create-a-board)",
  type: "action",
  version: "0.0.1",
  props: {
    monday,
    boardName: {
      propDefinition: [
        monday,
        "boardName",
      ],
    },
    boardKind: {
      propDefinition: [
        monday,
        "boardKind",
      ],
    },
    folderId: {
      propDefinition: [
        monday,
        "folderId",
      ],
    },
    workspaceId: {
      propDefinition: [
        monday,
        "workspaceId",
      ],
    },
    templateId: {
      propDefinition: [
        monday,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const {
      boardName,
      boardKind,
    } = this;

    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createBoard({
        boardName,
        boardKind,
        folderId: utils.emptyStrToUndefined(this.folderId),
        workspaceId: utils.emptyStrToUndefined(this.workspaceId),
        templateId: utils.emptyStrToUndefined(this.templateId),
      });

    if (errors) {
      throw new Error(`Failed to create board: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create board: ${errorMessage}`);
    }

    const { id: boardId } = data.create_board;

    $.export("$summary", `Successfully created a new board with ID: ${boardId}`);

    return boardId;
  },
};
