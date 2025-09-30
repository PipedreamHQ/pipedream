import zohoSprints from "../../zoho_sprints.app.mjs";

export default {
  key: "zoho_sprints-update-project-status",
  name: "Update Project Status",
  description: "Changes the status of an existing project in Zoho Sprints. [See the documentation](https://sprints.zoho.com/apidoc.html#Updateproject)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zohoSprints,
    teamId: {
      propDefinition: [
        zohoSprints,
        "teamId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoSprints,
        "projectId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    statusId: {
      propDefinition: [
        zohoSprints,
        "statusId",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = new URLSearchParams();
    data.append("status", this.statusId);

    const response = await this.zohoSprints.updateProject({
      teamId: this.teamId,
      projectId: this.projectId,
      data,
      $,
    });

    $.export("$summary", `Successfully updated project status for project with ID ${this.projectId}`);

    return response;
  },
};
