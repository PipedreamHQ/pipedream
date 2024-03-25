import outreach from "../../outreach.app.mjs";

export default {
  key: "outreach-add-prospect-sequence",
  name: "Add Prospect to Sequence",
  description: "Adds an existing prospect to a specific sequence in Outreach. [See the documentation](https://developers.outreach.io/api/reference/tag/prospect/)",
  version: "0.0.1",
  type: "action",
  props: {
    outreach,
    prospectId: {
      propDefinition: [
        outreach,
        "prospectId",
      ],
    },
    sequenceId: {
      propDefinition: [
        outreach,
        "sequenceId",
      ],
    },
    sequenceStartDate: {
      propDefinition: [
        outreach,
        "sequenceStartDate",
      ],
      optional: true,
    },
    sequenceStepsToExclude: {
      propDefinition: [
        outreach,
        "sequenceStepsToExclude",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.outreach.addProspectToSequence({
      prospectId: this.prospectId,
      sequenceId: this.sequenceId,
      sequenceStartDate: this.sequenceStartDate,
      sequenceStepsToExclude: this.sequenceStepsToExclude,
    });

    $.export("$summary", `Successfully added prospect ${this.prospectId} to sequence ${this.sequenceId}`);
    return response;
  },
};
