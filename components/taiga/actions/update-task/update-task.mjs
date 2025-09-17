import {
  cleanObj, parseObject,
} from "../../common/utils.mjs";
import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-update-task",
  name: "Update Task",
  description: "Update an existing task in a Taiga project. [See the documentation](https://docs.taiga.io/api.html#tasks-edit)",
  version: "0.0.1",
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        taiga,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    subject: {
      propDefinition: [
        taiga,
        "taskSubject",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        taiga,
        "taskDescription",
      ],
      optional: true,
    },
    isBlocked: {
      propDefinition: [
        taiga,
        "isBlocked",
      ],
      description: "Whether the task is blocked",
      optional: true,
    },
    milestone: {
      propDefinition: [
        taiga,
        "milestone",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        taiga,
        "taskStatus",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        taiga,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      label: "Assigned To",
      description: "User to assign the task to",
      optional: true,
    },
    userStoryId: {
      propDefinition: [
        taiga,
        "userStoryId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      label: "User Story",
      description: "User story to associate the task with",
      optional: true,
    },
    usOrder: {
      propDefinition: [
        taiga,
        "usOrder",
      ],
      optional: true,
    },
    taskboardOrder: {
      propDefinition: [
        taiga,
        "taskboardOrder",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        taiga,
        "tags",
      ],
      description: "Tags to associate with the task",
      optional: true,
    },
    watchers: {
      propDefinition: [
        taiga,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      type: "string[]",
      label: "Watchers",
      description: "Users to watch the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const task = await this.taiga.getTask({
      taskId: this.taskId,
    });
    const response = await this.taiga.updateTask({
      $,
      taskId: this.taskId,
      data: cleanObj({
        version: task.version,
        subject: this.subject,
        description: this.description,
        status: this.status,
        assigned_to: this.assignedTo,
        user_story: this.userStoryId,
        tags: parseObject(this.tags),
        watchers: parseObject(this.watchers),
        is_blocked: this.isBlocked,
        milestone: this.milestone,
        us_order: this.usOrder,
        taskboard_order: this.taskboardOrder,
      }),
    });

    $.export("$summary", `Updated task: ${response.id}`);
    return response;
  },
};
