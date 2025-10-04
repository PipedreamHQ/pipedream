import app from "../../paymo.app.mjs";

export default {
  key: "paymo-create-task",
  name: "Create Task",
  description: "Creates a task. [See the docs](https://github.com/paymoapp/api/blob/master/sections/tasks.md#create).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task.",
      optional: true,
    },
    taskListId: {
      propDefinition: [
        app,
        "taskListId",
      ],
    },
  },
  methods: {
    createTask(args = {}) {
      return this.app.create({
        path: "/tasks",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      name,
      description,
      taskListId,
    } = this;

    const response = await this.createTask({
      step,
      data: {
        name,
        description,
        tasklist_id: taskListId,
      },
    });

    step.export("$summary", `Successfully created task with ID ${response.tasks[0].id}`);

    return response;
  },
};
