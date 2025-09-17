import { parseObject } from "../../common/utils.mjs";
import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-create-task",
  name: "Create Task",
  description: "Create a new task in a Taiga project. [See the documentation](https://docs.taiga.io/api.html#tasks-create)",
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
    subject: {
      propDefinition: [
        taiga,
        "taskSubject",
      ],
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
    const response = await this.taiga.createTask({
      $,
      data: {
        subject: this.subject,
        description: this.description,
        project: this.projectId,
        status: this.status,
        assigned_to: this.assignedTo,
        user_story: this.userStoryId,
        tags: parseObject(this.tags),
        is_blocked: this.isBlocked,
        milestone: this.milestone,
        user_story_order: this.usOrder,
        taskboard_order: this.taskboardOrder,
        watchers: parseObject(this.watchers),
      },
    });

    $.export("$summary", `Created task: ${response.id}`);
    return response;
  },
};
