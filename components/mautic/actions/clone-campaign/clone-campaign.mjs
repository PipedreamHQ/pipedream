import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-clone-campaign",
  name: "Clone Campaign",
  description: "Clones an existing campaign. [See docs](https://developer.mautic.org/#clone-a-campaign)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mautic,
    campaignId: {
      propDefinition: [
        mautic,
        "campaignId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mautic.cloneCampaign({
      $,
      campaignId: this.campaignId,
    });
    $.export("$summary", "Successfully cloned campaign");
    return response;
  },
};
