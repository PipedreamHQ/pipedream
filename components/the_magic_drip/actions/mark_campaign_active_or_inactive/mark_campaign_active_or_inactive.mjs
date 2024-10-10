import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-mark-campaign-active-inactive",
  name: "Mark Campaign Active/Inactive",
  description: "Marks a campaign as active or inactive. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    desiredState: {
      type: "boolean",
      label: "Desired State",
      description: "Set to true to activate, false to deactivate the campaign",
    },
  },
  async run({ $ }) {
    const response = await this.app.markCampaignActiveInactive({
      campaignId: this.campaignId,
      desiredState: this.desiredState,
    });

    $.export("$summary", `Marked campaign ${this.campaignId} as ${this.desiredState
      ? "active"
      : "inactive"}.`);

    return response;
  },
};
