import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-delete-project",
  name: "Delete Project",
  description: "Deletes a project. [See the docs](https://api.proworkflow.net/?documentation#gettingstarteddeletesingle).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
  },
  methods: {
    deleteProject({
      projectId, ...args
    } = {}) {
      return this.app.delete({
        path: `/projects/${projectId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.deleteProject({
      step,
      projectId: this.projectId,
    });

    step.export("$summary", `${response.message} with ${response.status}.`);

    return response;
  },
};
