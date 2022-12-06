import common from "../common/task-props.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "clickup-update-task",
  name: "Update Task",
  description: "Update a task. See the docs [here](https://clickup.com/api) in **Tasks / Update Task** section.",
  version: "0.0.5",
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
    };

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
