import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-group",
  name: "Create Group",
  description: "Create a group (a titled section of rows) on a board. Use when you need somewhere to put new rows before calling **Create Item**, which takes an optional `Group ID`. Set `Board ID` and `Group Name`. Example: Board ID `2419687965`, Group Name `In Progress`. Returns the new group's ID as a string (e.g. `new_group12345`) — pass that value as `Group ID` to **Create Item**. Use **List Board ID Options** to find a valid `Board ID`. [See the documentation](https://developer.monday.com/api-reference/reference/groups#create-a-group)",
  type: "action",
  ai: "optimized",
  version: "0.0.17",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    groupName: {
      propDefinition: [
        monday,
        "groupName",
      ],
    },
  },
  async run({ $ }) {
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createGroup({
        boardId: +this.boardId,
        groupName: this.groupName,
      });

    if (errors) {
      throw new Error(`Failed to create group: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create group: ${errorMessage}`);
    }

    const { id: groupId } = data.create_group;

    $.export("$summary", `Successfully created a new group with ID: ${groupId}`);

    return groupId;
  },
};
