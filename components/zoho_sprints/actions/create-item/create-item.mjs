import zohoSprints from "../../zoho_sprints.app.mjs";

export default {
  key: "zoho_sprints-create-item",
  name: "Create Item",
  description: "Creates a new task, story, or bug in an existing Zoho Sprints project. [See the documentation](https://sprints.zoho.com/apidoc.html#Createitem)",
  version: "0.0.1",
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
    name: {
      type: "string",
      label: "Name",
      description: "Name of the item",
    },
    itemTypeId: {
      propDefinition: [
        zohoSprints,
        "itemTypeId",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
        }),
      ],
    },
    priorityTypeId: {
      propDefinition: [
        zohoSprints,
        "priorityTypeId",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
        }),
      ],
    },
    epicId: {
      propDefinition: [
        zohoSprints,
        "epicId",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
        }),
      ],
    },
    assignees: {
      propDefinition: [
        zohoSprints,
        "assignees",
        (c) => ({
          teamId: c.teamId,
          projectId: c.projectId,
        }),
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the item",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the item. `yyyy-MM-dd'T'HH:mm:ssZ (ISO format)` Example : 2017-10-13T00:00:00+05:30",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date of the item. `yyyy-MM-dd'T'HH:mm:ssZ (ISO format)` Example : 2017-10-13T00:00:00+05:30",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "Duration of the item",
      optional: true,
    },
    points: {
      type: "integer",
      label: "Points",
      description: "Estimation points set for the item. Index of the estimation points. Example: The index of 2 in a Fibonacci estimation type is 2 and the index of 8 will be 5.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new URLSearchParams();
    data.append("name", this.name);
    data.append("projitemtypeid", this.itemTypeId);
    data.append("projpriorityid", this.priorityTypeId);
    if (this.epicId) {
      data.append("epicId", this.epicId);
    }
    if (this.assignees) {
      data.append("users", JSON.stringify(this.assignees));
    }
    if (this.description) {
      data.append("description", this.description);
    }
    if (this.point) {
      data.append("point", this.point);
    }
    if (this.startdate) {
      data.append("startdate", this.startdate);
    }
    if (this.endDate) {
      data.append("enddate", this.enddate);
    }

    const response = await this.zohoSprints.createItem({
      teamId: this.teamId,
      projectId: this.projectId,
      sprintId: this.sprintId,
      data,
      $,
    });

    $.export("$summary", `Successfully created new item with ID ${response.addedItemId}.`);

    return response;
  },
};
