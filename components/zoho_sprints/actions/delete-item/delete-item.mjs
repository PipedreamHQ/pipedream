import zohoSprints from "../../zoho_sprints.app.mjs";

export default {
  key: "zoho_sprints-delete-item",
  name: "Delete Item",
  description: "Removes a specified task, story, or bug from a project in Zoho Sprints. [See the documentation](https://sprints.zoho.com/apidoc.html#Deleteitem)",
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
    sprintId: {
      propDefinition: [
        zohoSprints,
        "sprintId",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
        }),
      ],
    },
    itemId: {
      propDefinition: [
        zohoSprints,
        "itemId",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
          sprintId: c.sprintId,
        }),
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.zohoSprints.deleteItem({
      teamId: this.teamId,
      projectId: this.projectId,
      sprintId: this.sprintId,
      itemId: this.itemId,
      $,
    });

    $.export("$summary", `Successfully deleted item with id ${this.itemId}.`);

    return response;
  },
};
