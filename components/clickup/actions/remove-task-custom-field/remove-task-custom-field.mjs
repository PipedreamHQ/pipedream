import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-remove-task-custom-field",
  name: "Remove Task Custom Field",
  description: "Remove custom field from a task. See the docs [here](https://clickup.com/api) in **Custom Fields / Remove Custom Field Value** section.",
  version: "0.0.1",
  type: "action",
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
      optional: true,
    },
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
    customFieldId: {
      propDefinition: [
        clickup,
        "customFields",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      taskId,
      customFieldId,
    } = this;

    return this.clickup.removeTaskCustomField({
      $,
      taskId,
      customFieldId,
    });
  },
};
