import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-create-checklist-item",
  name: "Create Checklist Item",
  description: "Creates a new item in a checklist. See the docs [here](https://clickup.com/api) in **Checklists  / Create Checklist Item** section.",
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
    checklistId: {
      propDefinition: [
        clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of item",
    },
    assignee: {
      label: "Assignee",
      type: "string",
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      taskId,
      checklistId,
      name,
      assignee,
    } = this;

    const response = await this.clickup.createChecklistItem({
      $,
      taskId,
      checklistId,
      data: {
        name,
        assignee,
      },
    });

    $.export("$summary", "Successfully created checklist item");

    return response;
  },
};
