import app from "../../clevertap.app.mjs";

export default {
  key: "clevertap-stop-campaign",
  name: "Stop Campaign",
  description: "Stop a running campaign. [See the documentation](https://developer.clevertap.com/docs/stop-campaign-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    campaignId: {
      propDefinition: [
        app,
        "campaignId",
        ({
          from,
          to,
        }) => ({
          from,
          to,
        }),
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
