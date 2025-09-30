import app from "../../tableau.app.mjs";

export default {
  key: "tableau-create-project",
  name: "Create Project",
  description: "Creates a project on the specified site. You can also create project hierarchies by creating a project under the specified parent project on the site. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_projects.htm#create_project)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the new project to create",
    },
    description: {
      type: "string",
      label: "Project Description",
      description: "The description of the new project to create",
      optional: true,
    },
    parentProjectId: {
      propDefinition: [
        app,
        "parentProjectId",
        ({ siteId }) => ({
          siteId,
        }),
      ],
    },
  },
  methods: {
    createProject({
      siteId, ...args
    } = {}) {
      return this.app.post({
        path: `/sites/${siteId}/projects`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createProject,
      siteId,
      name,
      description,
      parentProjectId,
    } = this;

    const response = await createProject({
      $,
      siteId,
      data: {
        project: {
          name,
          description,
          parentProjectId,
        },
      },
    });

    $.export("$summary", `Successfully created project with ID \`${response.project?.id}\``);
    return response;
  },
};
