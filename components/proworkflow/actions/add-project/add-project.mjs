import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-add-project",
  name: "Add Project",
  description: "Adds a project. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedpostsingle).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the project.",
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
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
      companyId,
      title,
      categoryId,
    } = this;

    const response = await this.createProject({
      step,
      data: {
        companyid: companyId,
        title,
        categoryid: categoryId,
      },
    });

    step.export("$summary", `${response.message} with ${response.status}.`);

    return response;
  },
};
