import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-create-project",
  name: "Create Project",
  description: "Creates a project. [See the docs here](https://www.zoho.com/projects/help/rest-api/projects-api.html#alink5)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoProjects,
    portalId: {
      propDefinition: [
        zohoProjects,
        "portalId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the project.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      name,
      description,
    } = this;

    const { projects } =
      await this.zohoProjects.createProject({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        data: {
          name,
          description,
        },
      });

    const project = projects[0];

    $.export("$summary", `Successfully created a new project with ID ${project.id_string}`);

    return project;
  },
};
