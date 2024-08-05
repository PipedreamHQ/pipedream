import dart from "../../dart.app.mjs";

export default {
  key: "dart-find-or-create-task",
  name: "Find or Create Task",
  description: "Checks for an existing task within a dartboard using the 'task-name'. If it doesn't exist, a new task is created.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dart,
    dartboard: {
      propDefinition: [
        dart,
        "dartboard",
      ],
    },
    taskName: {
      propDefinition: [
        dart,
        "taskName",
      ],
    },
    newTaskName: {
      propDefinition: [
        dart,
        "newTaskName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        dart,
        "description",
      ],
      optional: true,
    },
    newDescription: {
      propDefinition: [
        dart,
        "newDescription",
      ],
      optional: true,
    },
    dueDate: {
      propDefinition: [
        dart,
        "dueDate",
      ],
      optional: true,
    },
    newDueDate: {
      propDefinition: [
        dart,
        "newDueDate",
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        dart,
        "assignedTo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const task = await this.dart.checkAndCreateTask({
      dartboard: this.dartboard,
      taskName: this.taskName,
      newTaskName: this.newTaskName,
      description: this.description,
      newDescription: this.newDescription,
      dueDate: this.dueDate,
      newDueDate: this.newDueDate,
      assignedTo: this.assignedTo,
    });

    $.export("$summary", task
      ? `Task ${this.taskName} found or created successfully`
      : "No task found or created");
    return task;
  },
};
