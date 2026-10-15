import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-board",
  name: "Create Board",
  description: "Create a new board in a workspace. Use when you need a new board before adding groups, columns or items to it. Set `Board Name` and `Board Kind` (`public`, `private` or `share`); if you omit `Workspace ID` the board is created in the Main Workspace. Example: Board Name `Q3 Campaigns`, Board Kind `public`. Returns the new board's ID as a string (e.g. `2419687965`), not the full board object — call **List Boards** if you need its details. Use **List Workspace ID Options** to find a valid `Workspace ID`. [See the documentation](https://developer.monday.com/api-reference/reference/boards#create-a-board)",
  type: "action",
  ai: "optimized",
  version: "0.0.16",
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
