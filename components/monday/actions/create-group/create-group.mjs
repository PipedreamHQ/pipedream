import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-group",
  name: "Create Group",
  description: "Creates a new group in a specific board. [See the documentation](https://developer.monday.com/api-reference/reference/groups#create-a-group)",
  type: "action",
  version: "0.0.10",
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
