import app from "../../clevertap.app.mjs";

export default {
  key: "clevertap-get-campaign-report",
  name: "Get Campaign Report",
  description: "Get the report for a completed campaign. [See the documentation](https://developer.clevertap.com/docs/get-campaign-report-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "The ID of the campaign to retrieve the report for.",
      propDefinition: [
        app,
        "campaignId",
        ({
          from, to,
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

    const response = await app.getCampaignReport({
      $,
      data: {
        id: campaignId,
      },
    });

    $.export("$summary", "Successfully retrieved report for campaign");

    return response;
  },
};
