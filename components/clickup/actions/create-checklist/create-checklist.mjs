import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-create-checklist",
  name: "Create Checklist",
  description: "Creates a new checklist in a task. See the docs [here](https://clickup.com/api) in **Checklists  / Create Checklist** section.",
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
    name: {
      label: "Name",
      type: "string",
      description: "The name of checklist",
    },
  },
  async run({ $ }) {
    const {
      taskId,
      name,
    } = this;

    return this.clickup.createChecklist({
      $,
      taskId,
      data: {
        name,
      },
    });
  },
};
