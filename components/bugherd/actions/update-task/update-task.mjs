import app from "../../bugherd.app.mjs";
import { PRIORITY_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "bugherd-update-task",
  name: "Update Task",
  description: "Update one of the tasks in a project. [See the documentation](https://www.bugherd.com/api_v2#api_task_update)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task",
      options: PRIORITY_OPTIONS,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task. Values are 'feedback', 'closed'. For projects with custom columns, pass the column name. Omit or set as null to send tasks to the Feedback panel.",
      optional: true,
    },
    assignedToEmail: {
      propDefinition: [
        app,
        "assignedToEmail",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    updaterEmail: {
      type: "string",
      label: "Updater Email",
      description: "The email of the user who is updating the task. This is only for audit logging purposes",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      projectId,
      taskId,
      ...data
    } = this;

    if (Object.keys(data).length === 0) {
      $.export("$summary", `No data to update for task ${this.taskId}`);
      return {};
    }

    const response = await app.updateTask({
      $,
      projectId,
      taskId,
      data: {
        task: {
          description: this.description,
          priority: this.priority,
          status: this.status,
          assignedToEmail: this.assignedToEmail,
          updaterEmail: this.updaterEmail,
        },
      },
    });

    $.export("$summary", `Successfully updated task ${this.taskId}`);
    return response;
  },
};

