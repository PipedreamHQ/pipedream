import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-delete-checklist",
  name: "Delete Checklist",
  description: "Deletes a checklist in a task. [See the documentation](https://clickup.com/api) in **Checklists / Delete Checklist** section.",
  version: "0.0.13",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
        }),
      ],
    },
    checklistId: {
      propDefinition: [
        common.props.clickup,
        "checklistId",
        (c) => ({
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { checklistId } = this;

    const response = await this.clickup.deleteChecklist({
      $,
      checklistId,
    });

    $.export("$summary", "Successfully deleted checklist");

    return response;
  },
};
