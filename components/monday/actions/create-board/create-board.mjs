import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-board",
  name: "Create Board",
  description: "Creates a new board. [See the documentation](https://developer.monday.com/api-reference/reference/boards#create-a-board)",
  type: "action",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    workspaceId: {
      propDefinition: [
        monday,
        "workspaceId",
      ],
    },
    folderId: {
      propDefinition: [
        monday,
        "folderId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
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
      folderId,
      workspaceId,
      templateId,
    } = this;

    const {
      data,
      errors,
      error_code: errorCode,
      error_message: errorMessage,
    } =
      await this.monday.createBoard({
        boardName,
        boardKind,
        folderId: utils.emptyStrToUndefined(folderId),
        workspaceId: utils.emptyStrToUndefined(workspaceId),
        templateId: utils.emptyStrToUndefined(templateId),
      });

    if (errors) {
      throw new Error(`Failed to create board: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create board [${errorCode}]: ${errorMessage}`);
    }

    const { id: boardId } = data.create_board;

    $.export("$summary", `Successfully created a new board with ID: ${boardId}`);

    return boardId;
  },
};
