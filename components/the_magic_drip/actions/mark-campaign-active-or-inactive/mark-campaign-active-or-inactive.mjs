import app from "../../the_magic_drip.app.mjs";

export default {
  key: "the_magic_drip-mark-campaign-active-or-inactive",
  name: "Mark Campaign Active or Inactive",
  description: "Marks a campaign as active or inactive. [See the documentation](https://docs.themagicdrip.com/api-reference/endpoint/post-v1campaign-active)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
      ],
    },
    activate: {
      type: "boolean",
      label: "Activate",
      description: "Set to `true` to activate, or `false` to deactivate the campaign",
    },
  },
  async run({ $ }) {
    const {
      campaignId, activate,
    } = this;
    const response = await this.app.markCampaignActiveInactive({
      $,
      campaignId,
      activate,
    });

    $.export("$summary", `Successfully ${activate
      ? ""
      : "de"}activated campaign`);

    return response;
  },
};
