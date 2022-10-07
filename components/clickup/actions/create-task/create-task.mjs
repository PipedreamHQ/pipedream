import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "clickup-create-task",
  name: "Create Task",
  description: "Creates a new task. See the docs [here](https://clickup.com/api) in **Tasks  / Create Task** section.",
  version: "0.0.6",
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
    name: {
      label: "Name",
      type: "string",
      description: "The name of task",
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
    tags: {
      propDefinition: [
        clickup,
        "tags",
        (c) => ({
          spaceId: c.spaceId,
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
      listId,
      name,
      description,
      priority,
      assignees,
      tags,
      status,
      parent,
    } = this;

    const response = await this.clickup.createTask({
      $,
      listId,
      data: {
        name,
        description,
        priority: constants.PRIORITIES[priority] || constants.PRIORITIES["Normal"],
        assignees,
        tags,
        status,
        parent,
      },
    });

    $.export("$summary", "Successfully created task");

    return response;
  },
};
