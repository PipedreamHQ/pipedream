import { ConfigurationError } from "@pipedream/platform";
import constants from "../common/constants.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-task",
  name: "Update Task",
  description: "Update a task. [See the documentation](https://clickup.com/api) in **Tasks / Update Task** section.",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      description: "To show options please select a **List** first",
    },
    status: {
      propDefinition: [
        common.props.clickup,
        "status",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
    parent: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      label: "Parent Task ID",
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
