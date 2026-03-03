import { ConfigurationError } from "@pipedream/platform";
import freedcamp from "../../freedcamp.app.mjs";

export default {
  key: "freedcamp-create-task",
  name: "Create Task",
  description: "Creates a new task in a Freedcamp project. [See the documentation](https://freedcamp.com/help_/tutorials/wiki/wiki_public/view/DFaab#post_fcu_8)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    freedcamp,
    projectId: {
      propDefinition: [
        freedcamp,
        "projectId",
      ],
      label: "Project",
      description: "Project to create the task in",
    },
    taskGroupId: {
      propDefinition: [
        freedcamp,
        "taskGroupId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Task List",
      description: "Task list (group) to add the task to. Leave empty to use the first list.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Task title",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Task description (HTML supported)",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Task priority",
      options: [
        {
          label: "None",
          value: "0",
        },
        {
          label: "Low",
          value: "1",
        },
        {
          label: "Medium",
          value: "2",
        },
        {
          label: "High",
          value: "3",
        },
      ],
      optional: true,
      default: "0",
    },
    assignedToId: {
      type: "string",
      label: "Assigned To",
      description: "User ID to assign the task to. Use 0 for unassigned, -1 for everyone.",
      optional: true,
      default: "0",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in YYYY-MM-DD format",
      optional: true,
    },
    rRule: {
      type: "string",
      label: "R Rule",
      description: "The recurrence rule in [iCalendar](https://en.wikipedia.org/wiki/ICalendar) [(RFC 5545)](https://datatracker.ietf.org/doc/html/rfc5545) format, can be an empty string or absent",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date in YYYY-MM-DD format",
      optional: true,
    },
    hParentId: {
      propDefinition: [
        freedcamp,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      label: "Parent ID",
      description: "Parent ID to add to the task",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const task = await this.freedcamp.createTask({
        $,
        data: {
          title: this.title,
          description: this.description,
          project_id: this.projectId,
          task_group_id: this.taskGroupId,
          priority: this.priority,
          assigned_to_id: this.assignedToId,
          due_date: this.dueDate,
          start_date: this.startDate,
          r_rule: this.rRule,
          h_parent_id: this.hParentId,
        },
      });

      $.export("$summary", `Created task with ID: ${task.data.tasks[0].id}`);
      return task;
    } catch ({ response }) {
      const messageErrors = response.data.data.errors;
      let messageError = "";
      Object.keys(messageErrors).forEach((key) => {
        messageError += `${key}: ${messageErrors[key]}\n`;
      });
      throw new ConfigurationError(messageError);
    }
  },
};
