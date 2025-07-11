import app from "../../clevertap.app.mjs";

export default {
  key: "clevertap-stop-campaign",
  name: "Stop Campaign",
  description: "Stop a running campaign. [See the documentation](https://developer.clevertap.com/docs/stop-campaign-api)",
  version: "0.0.1",
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
  async run({ $ }) {
    const {
      app,
      campaignId,
    } = this;

    const response = await app.stopCampaign({
      $,
      data: {
        id: campaignId,
      },
    });

    $.export("$summary", "Successfully stopped campaign");

    return response;
  },
};
