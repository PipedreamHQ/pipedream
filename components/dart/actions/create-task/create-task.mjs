import dart from "../../dart.app.mjs";

export default {
  key: "dart-create-task",
  name: "Create Task",
  description: "Creates a new task within a dartboard. [See the documentation](https://app.itsdart.com/api/v0/docs/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dart,
    dartboardId: {
      propDefinition: [
        dart,
        "dartboardId",
      ],
    },
    duid: {
      type: "string",
      label: "Task DUID",
      description: "A unique identifier for the task. Must contain at least 12 characters.",
    },
    title: {
      propDefinition: [
        dart,
        "taskName",
      ],
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
        clientDuid: this.duid,
        items: [
          {
            duid: this.duid,
            operations: [
              {
                model: "task",
                kind: "create",
                data: {
                  duid: this.duid,
                  dartboardDuid: this.dartboardId,
                  title: this.title,
                  description: this.description,
                  dueAt: this.dueAt,
                  assigneeDuids: this.assigneeIds,
                  priority: this.priority,
                },
              },
            ],
            kind: "task_create",
          },
        ],
      },
    });
    $.export("$summary", `Created task "${this.title}"`);
    return response;
  },
};
