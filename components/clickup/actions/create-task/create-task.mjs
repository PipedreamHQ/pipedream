import clickup from "../../clickup.app.mjs";
import common from "../common/list-props.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "clickup-create-task",
  name: "Create Task",
  description: "Creates a new task. See the docs [here](https://clickup.com/api) in **Tasks / Create Task** section.",
  version: "0.0.10",
  type: "action",
  props: {
    ...common.props,
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
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the task in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). e.g. `2023-05-13T23:45:44Z`",
      optional: true,
    },
    dueDateTime: {
      type: "boolean",
      label: "Due Date Time",
      description: "If set `true`, due date will be given with time. If not it will only be the closest date",
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
      dueDate,
      dueDateTime: due_date_time,
    } = this;
    const due_date = (new Date(dueDate)).getTime();

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
        due_date,
        due_date_time,
      },
    });

    $.export("$summary", "Successfully created task");

    return response;
  },
};
