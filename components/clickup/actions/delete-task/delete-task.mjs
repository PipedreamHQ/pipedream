import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-delete-task",
  name: "Delete Task",
  description: "Delete a task. See the docs [here](https://clickup.com/api) in **Tasks  / Delete Task** section.",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
      optional: true,
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { taskId } = this;

    const response = await this.clickup.deleteTask({
      $,
      taskId,
    });

    $.export("$summary", "Successfully deleted task");

    return response;
  },
};
