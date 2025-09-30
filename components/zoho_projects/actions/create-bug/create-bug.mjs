import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-create-bug",
  name: "Create Bug",
  description: "Creates a bug. [See the docs here](https://www.zoho.com/projects/help/rest-api/bugs-api.html#alink3)",
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
    projectId: {
      propDefinition: [
        zohoProjects,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Name of the bug.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the bug.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      portalId,
      projectId,
      title,
      description,
    } = this;

    const { bugs } =
      await this.zohoProjects.createBug({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        projectId,
        data: {
          title,
          description,
        },
      });

    const bug = bugs[0];

    $.export("$summary", `Successfully created a new bug with ID ${bug.id_string}`);

    return bug;
  },
};
