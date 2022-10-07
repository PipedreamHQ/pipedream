import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes a checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists  / Delete Checklist** section.",
  version: "0.0.3",
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
    useCustomTaskIds: {
      propDefinition: [
        clickup,
        "useCustomTaskIds",
      ],
    },
    authorizedTeamId: {
      propDefinition: [
        clickup,
        "authorizedTeamId",
      ],
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
        }),
      ],
    },
    checklistId: {
      propDefinition: [
        clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      taskId,
      checklistId,
    } = this;

    const response = await this.clickup.deleteChecklist({
      $,
      taskId,
      checklistId,
    });

    $.export("$summary", "Successfully deleted checklist");

    return response;
  },
};
