import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-add-project-task",
  name: "Add Project Task",
  description: "Adds a project task. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedpostsingle).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "taskName",
      ],
    },
  },
  methods: {
    createProjectTask({
      projectId, ...args
    } = {}) {
      return this.app.create({
        path: `/projects/${projectId}/tasks`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      projectId,
      name,
    } = this;

    const response = await this.createProjectTask({
      step,
      projectId,
      data: {
        name,
      },
    });

    step.export("$summary", `${response.message} with ${response.status}.`);

    return response;
  },
};
