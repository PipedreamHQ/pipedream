import app from "../../paymo.app.mjs";

export default {
  key: "paymo-create-project",
  name: "Create Project",
  description: "Creates a project. [See the docs](https://github.com/paymoapp/api/blob/master/sections/projects.md#create).",
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
      description: "The name of the project.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the project.",
      optional: true,
    },
    clientId: {
      optional: true,
      propDefinition: [
        app,
        "clientId",
      ],
    },
  },
  methods: {
    createProject(args = {}) {
      return this.app.create({
        path: "/projects",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      name,
      description,
      clientId,
    } = this;

    const response = await this.createProject({
      step,
      data: {
        name,
        description,
        client_id: clientId,
      },
    });

    step.export("$summary", `Successfully created project with ID ${response.projects[0].id}`);

    return response;
  },
};
