import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-add-client-to-project",
  name: "Add Client to Project",
  description: "Adds a client to a project. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedpostsingle).",
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
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
  },
  methods: {
    addClientToProject({
      projectId, ...args
    } = {}) {
      return this.app.update({
        path: `/projects/${projectId}/contacts`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      projectId, clientId,
    } = this;

    const response = await this.addClientToProject({
      projectId,
      data: {
        clients: clientId,
      },
    });

    step.export("$summary", `${response.message} with ${response.status}.`);

    return response;
  },
};
