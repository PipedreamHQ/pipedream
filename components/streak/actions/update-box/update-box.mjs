import streak from "../../streak.app.mjs";

const docLink = "https://streak.readme.io/reference/edit-a-box";

export default {
  key: "streak-update-box",
  name: "Update Box",
  description: `Update the properties for a box. To update field values use **Update Box Field Value**. [See the docs](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streak,
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
    boxId: {
      propDefinition: [
        streak,
        "boxId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the box",
      optional: true,
    },
    stage: {
      propDefinition: [
        streak,
        "stage",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The notes on the box",
      optional: true,
    },
    teamId: {
      propDefinition: [
        streak,
        "teamId",
      ],
      optional: true,
    },
    assignees: {
      propDefinition: [
        streak,
        "teamMembers",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
      description: "The member(s) of your team this box will be assigned to",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.streak.updateBox({
      $,
      boxId: this.boxId,
      data: {
        name: this.name,
        stageKey: this.stage,
        notes: this.notes,
        assignedToSharingEntries: this.assignees?.map((assignee) => ({
          email: assignee,
        })),
      },
    });
    $.export("$summary", "Successfully updated box");
    return response;
  },
};
