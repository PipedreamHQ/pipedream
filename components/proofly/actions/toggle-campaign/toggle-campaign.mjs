import app from "../../proofly.app.mjs";

export default {
  key: "proofly-toggle-campaign",
  name: "Toggle Campaign Status",
  description: "Switch a campaign's status between active and inactive. [See the documentation](https://proofly.io/developers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
  },
  methods: {
    switchCampaignStatus({
      campaignId, ...args
    }) {
      return this.app.put({
        path: `/campaign/${campaignId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      campaignId,
      switchCampaignStatus,
    } = this;

    const response = await switchCampaignStatus({
      $,
      campaignId,
    });

    $.export("$summary", `Successfully toggled campaign with status \`${response.status}\` and message \`${response.data}\``);

    return response;
  },
};
