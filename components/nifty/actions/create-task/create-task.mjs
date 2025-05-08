import nifty from "../../nifty.app.mjs";

export default {
  key: "nifty-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://developers.niftypm.com/operation/operation-taskapicontroller_createtask)",
  version: "0.0.1",
  type: "action",
  props: {
    nifty,
    projectId: {
      propDefinition: [
        nifty,
        "projectId",
      ],
    },
    taskGroupId: {
      propDefinition: [
        nifty,
        "taskGroupId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the task",
      optional: true,
    },
    order: {
      type: "integer",
      label: "Order",
      description: "The order of the task",
      optional: true,
    },
    parentTaskId: {
      propDefinition: [
        nifty,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Parent Task ID",
      description: "Enter a parent task ID to create this task as subtask of another task",
      optional: true,
    },
    milestoneId: {
      propDefinition: [
        nifty,
        "milestoneId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the task in ISO-8601 format",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the task in ISO-8601 format",
      optional: true,
    },
    assigneeIds: {
      propDefinition: [
        nifty,
        "memberId",
      ],
      type: "string[]",
      label: "Assignee IDs",
      description: "An array of assignee IDs to assign to the task",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "An array of labels to add to the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nifty.createTask({
      $,
      data: {
        task_group_id: this.taskGroupId,
        name: this.name,
        description: this.description,
        order: this.order,
        task_id: this.parentTaskId,
        milestone_id: this.milestoneId,
        due_date: this.dueDate,
        start_date: this.startDate,
        assignee_ids: this.assigneeIds,
        labels: this.labels,
      },
    });
    $.export("$summary", `Successfully created task with ID: ${response.id}`);
    return response;
  },
};
