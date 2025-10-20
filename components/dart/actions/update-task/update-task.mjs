import dart from "../../dart.app.mjs";

export default {
  key: "dart-update-task",
  name: "Update Task",
  description: "Updates an existing task within a dartboard. [See the documentation](https://app.itsdart.com/api/v0/docs/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dart,
    taskId: {
      propDefinition: [
        dart,
        "taskId",
      ],
    },
    title: {
      propDefinition: [
        dart,
        "taskName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        dart,
        "taskDescription",
      ],
    },
    dueAt: {
      propDefinition: [
        dart,
        "dueAt",
      ],
    },
    assigneeIds: {
      propDefinition: [
        dart,
        "assigneeIds",
      ],
    },
    priority: {
      propDefinition: [
        dart,
        "priority",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dart.createTransaction({
      $,
      data: {
        clientDuid: this.taskId,
        items: [
          {
            duid: this.taskId,
            operations: [
              {
                model: "task",
                kind: "update",
                data: {
                  duid: this.taskId,
                  dartboardDuid: this.dartboardId,
                  title: this.title,
                  description: this.description,
                  dueAt: this.dueAt,
                  assigneeDuids: this.assigneeIds,
                  priority: this.priority,
                },
              },
            ],
            kind: "task_update",
          },
        ],
      },
    });
    $.export("$summary", `Updated task with ID: "${this.taskId}"`);
    return response;
  },
};
