import dart from "../../dart.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dart-create-task",
  name: "Create Task",
  description: "Creates a new task within a dartboard. [See the documentation](https://app.itsdart.com/api/v0/docs/)",
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
    description: {
      propDefinition: [
        dart,
        "description",
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
    assignedTo: {
      propDefinition: [
        dart,
        "assignedTo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const task = {
      dartboard: this.dartboard,
      taskName: this.taskName,
      description: this.description,
      dueDate: this.dueDate,
      assignedTo: this.assignedTo,
    };

    const response = await this.dart.createTask(task);
    $.export("$summary", `Created task ${this.taskName}`);
    return response;
  },
};
