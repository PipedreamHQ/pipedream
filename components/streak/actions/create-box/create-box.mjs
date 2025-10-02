import streak from "../../streak.app.mjs";

const docLink = "https://streak.readme.io/reference/create-a-box";

export default {
  key: "streak-create-box",
  name: "Create Box",
  description: `Create a new box in Streak. [See the docs](${docLink})`,
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      reloadProps: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the box",
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
  async additionalProps() {
    const props = {};
    const fields = await this.streak.listPipelineFields({
      pipelineId: this.pipelineId,
    });
    for (const field of fields) {
      props[`${this.pipelineId}_${field.key}`] = this.streak.customFieldToProp(field);
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.streak.createBox({
      $,
      pipelineId: this.pipelineId,
      data: {
        name: this.name,
        stageKey: this.stage,
        notes: this.notes,
        assignedToSharingEntries: this.assignees?.map((assignee) => ({
          email: assignee,
        })),
      },
    });

    const updateCustomFields = Object.keys(this)
      .filter((k) => k.includes(`${this.pipelineId}_`))
      .map((k) => this.streak.updateFieldValue({
        boxId: response.boxKey,
        fieldId: k.split(`${this.pipelineId}_`)[1],
        value: this[k],
      }));
    await Promise.all(updateCustomFields);

    $.export("$summary", "Successfully created box");
    return response;
  },
};
