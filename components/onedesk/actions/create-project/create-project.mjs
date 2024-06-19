import app from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-project",
  name: "Create Project",
  description: "Creates a project/space. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project.",
    },
    type: {
      label: "Project Type",
      description: "Type of the project.",
      propDefinition: [
        app,
        "containerType",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the project",
      optional: true,
    },
    parentPortfolioExternalIds: {
      propDefinition: [
        app,
        "parentPortfolioExternalIds",
      ],
    },
  },
  methods: {
    createProject(args = {}) {
      return this.app.post({
        path: "/projects/",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createProject,
      type,
      name,
      description,
      parentPortfolioExternalIds,
    } = this;

    const response = await createProject({
      $,
      data: {
        type,
        name,
        description,
        parentPortfolioExternalIds,
      },
    });

    $.export("$summary", `Successfully created project with ID \`${response.data}\`.`);

    return response;
  },
};
