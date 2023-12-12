import common from "../common/task-props.mjs";
import constants from "../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "clickup-update-task",
  name: "Update Task",
  description: "Update a task. See the docs [here](https://clickup.com/api) in **Tasks / Update Task** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
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
        common.props.clickup,
        "priorities",
      ],
      optional: true,
    },
    assignees: {
      propDefinition: [
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        common.props.clickup,
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
        common.props.clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      optional: true,
    },
    dueDate: {
      label: "Due Date",
      type: "string",
      description: "The due date of task, please use `YYYY-MM-DD` format",
      optional: true,
    },
    startDate: {
      label: "Start Date",
      type: "string",
      description: "The start date of task, please use `YYYY-MM-DD` format",
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

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const data = {
      name,
      description,
      assignees: {
        add: assignees,
        rem: [],
      },
      status,
      parent,
      due_date: this.dueDate
        ? new Date(this.dueDate).getTime()
        : undefined,
      start_date: this.startDate
        ? new Date(this.startDate).getTime()
        : undefined,
    };

    if (data.due_date && isNaN(data.due_date)) {
      throw new ConfigurationError("Due date is not a valid date");
    }

    if (data.start_date && isNaN(data.start_date)) {
      throw new ConfigurationError("Start date is not a valid date");
    }

    if (priority) data[priority] = constants.PRIORITIES[priority];

    const response = await this.clickup.updateTask({
      $,
      taskId,
      data,
      params,
    });

    $.export("$summary", "Successfully updated task");

    return response;
  },
};
