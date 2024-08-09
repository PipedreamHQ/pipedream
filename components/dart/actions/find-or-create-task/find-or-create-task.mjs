import dart from "../../dart.app.mjs";

export default {
  key: "dart-find-or-create-task",
  name: "Find or Create Task",
  description: "Checks for an existing task within a dartboard using the 'task-name'. If it doesn't exist, a new task is created. [See the documentation](https://app.itsdart.com/api/v0/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    dart,
    dartboardId: {
      propDefinition: [
        dart,
        "dartboardId",
      ],
    },
    taskName: {
      propDefinition: [
        dart,
        "taskName",
      ],
    },
    duid: {
      type: "string",
      label: "Task DUID",
      description: "If the task is not found, a unique identifier to assign to the newly created task. Must contain at least 12 characters.",
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
    const { results } = await this.dart.listTasks({
      $,
      params: {
        title: this.taskName,
      },
    });

    const matchingTasks = results.filter(({ dartboardDuid }) => dartboardDuid === this.dartboardId);

    if (matchingTasks?.length) {
      $.export("$summary", `Successfully found task "${this.taskName}"`);
      return matchingTasks;
    }

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
                  title: this.taskName,
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

    if (!response.results[0].success) {
      throw new Error(response.results[0].message);
    }

    $.export("$summary", `Created task: "${this.taskName}"`);
    return response;
  },
};
