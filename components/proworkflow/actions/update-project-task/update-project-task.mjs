import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-update-project-task",
  name: "Update Project Task",
  description: "Updates a project task. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedputsingle).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        app,
        "taskName",
      ],
    },
    description: {
      propDefinition: [
        app,
        "taskDescription",
      ],
    },
    priority: {
      propDefinition: [
        app,
        "taskPriority",
      ],
    },
    startdate: {
      propDefinition: [
        app,
        "taskStartDate",
      ],
    },
    duedate: {
      propDefinition: [
        app,
        "taskDueDate",
      ],
    },
  },
  methods: {
    updateTask({
      taskId, ...args
    } = {}) {
      return this.app.update({
        path: `/tasks/${taskId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      taskId,
      name,
      description,
      priority,
      startdate,
      duedate,
    } = this;

    const response = await this.updateTask({
      step,
      taskId,
      data: {
        name,
        description,
        priority,
        startdate,
        duedate,
      },
    });

    step.export("$summary", `${response.message} with ${response.status}.`);

    return response;
  },
};
