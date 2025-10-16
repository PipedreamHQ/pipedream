import zohoProjects from "../../zoho_projects.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_projects-create-milestone",
  name: "Create Milestone",
  description: "Creates a milestone. [See the docs here](https://www.zoho.com/projects/help/rest-api/milestones-api.html#alink3)",
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
    name:	{
      type: "string",
      label: "Name",
      description:	"Name of the milestone.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the milestone. E.g. (`[MM-DD-YYYY]`)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the milestone. E.g. (`[MM-DD-YYYY]`)",
    },
    owner: {
      label: "Owner",
      description: "User ID of the project.",
      propDefinition: [
        zohoProjects,
        "projectUserId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
    },
    flag:	{
      type: "string",
      label: "Flag",
      description: "Milestone flag must be `internal` or `external`.",
      options: [
        "internal",
        "external",
      ],
    },
  },
  async run({ $ }) {
    const {
      portalId,
      projectId,
      name,
      startDate,
      endDate,
      owner,
      flag,
    } = this;

    const { milestones } =
      await this.zohoProjects.createMilestone({
        $,
        headers: constants.MULTIPART_FORM_DATA_HEADERS,
        portalId,
        projectId,
        data: {
          name,
          start_date: startDate,
          end_date: endDate,
          owner,
          flag,
        },
      });

    const milestone = milestones[0];

    $.export("$summary", `Successfully created a new milestone with ID ${milestone.id_string}`);

    return milestone;
  },
};
