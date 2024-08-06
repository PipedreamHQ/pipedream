import dart from "../../dart.app.mjs";

export default {
  key: "dart-create-task",
  name: "Create Task",
  description: "Creates a new task within a dartboard. [See the documentation](https://app.itsdart.com/api/v0/docs/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dart,
    dartboardId: {
      propDefinition: [
        dart,
        "dartboardId",
      ],
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
  },
  async run({ $ }) {
    const response = await this.dart.createTransaction({
      $,
      data: {
        items: [
          {
            operations: [
              {
                model: "task",
                kind: "create",
                data: {
                  dartboardDuid: this.dartboardId,
                  tile: this.title,
                  description: this.description,
                },
              },
            ],
            kind: "task_create",
          },
        ],
      },
    });
    $.export("$summary", `Created task ${this.taskName}`);
    return response;
  },
};
