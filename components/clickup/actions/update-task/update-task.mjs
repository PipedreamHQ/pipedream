import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "clickup-update-task",
  name: "Update Task",
  description: "Update a task. See the docs [here](https://clickup.com/api) in **Tasks  / Update Task** section.",
  version: "0.0.1",
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
      description: "The name of task",
      optional: true,
    },
    description: {
      label: "Description",
      type: "string",
      description: "The description of task",
      optional: true,
    },
    priority: {
      propDefinition: [
        clickup,
        "priorities",
      ],
      optional: true,
    },
    assignees: {
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        clickup,
        "statuses",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
    parent: {
      label: "Parent Task",
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      taskId,
      name,
      description,
      priority,
      assignees,
      status,
      parent,
    } = this;

    const data = {
      name,
      description,
      assignees,
      status,
      parent,
    };

    if (priority) data[priority] = constants.PRIORITIES[priority];

    const response = await this.clickup.updateTask({
      $,
      taskId,
      data,
    });

    $.export("$summary", "Successfully updated task");

    return response;
  },
};
