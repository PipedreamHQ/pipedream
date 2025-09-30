import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-update-project",
  name: "Update Project",
  description: "Updates a project. [See the docs here](https://www.zoho.com/projects/help/rest-api/projects-api.html#alink6)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    projectId: {
      propDefinition: [
        zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the project must be `active` or `archived`.",
      options: [
        "active",
        "archived",
      ],
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
      projectId,
      name,
      status,
      description,
    } = this;

    const { projects } =
      await this.zohoProjects.updateProject({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        projectId,
        data: {
          name,
          status,
          description,
        },
      });

    const project = projects[0];

    $.export("$summary", `Successfully updated the project with ID ${project.id_string}`);

    return project;
  },
};
