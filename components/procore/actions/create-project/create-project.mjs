import app from "../../procore.app.mjs";

export default {
  key: "procore-create-project",
  name: "Create Project",
  description: "Creates a new project. [See the docs](https://developers.procore.com/reference/rest/v1/projects?version=1.0#create-project).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
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
      companyId,
      name,
      description,
    } = this;

    const response = await this.createProject({
      step,
      headers: this.app.companyHeader(companyId),
      data: {
        company_id: companyId,
        project: {
          name,
          description,
        },
      },
    });

    step.export("$sumary", `Successfully created project with ID ${response.id}`);

    return response;
  },
};
