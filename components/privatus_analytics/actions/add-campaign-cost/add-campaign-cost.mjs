import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-add-campaign-cost",
  name: "Add Campaign Cost",
  description: "Records what a campaign cost in a month, for cost per acquisition and return on ad spend (Business plan). [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    campaign: {
      type: "string",
      label: "Campaign",
      description: "The `utm_campaign` value the cost belongs to, exactly as it arrives on the site.",
    },
    month: {
      type: "string",
      label: "Month",
      description: "The month the money was spent, as `YYYY-MM`. Any day in it works, like `2026-10-01`.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The spend for the month in major currency units, like `1250.50`.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "3-letter ISO 4217 code in capitals, e.g. USD. Defaults to the site currency.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/campaigns/costs.json`,
      data: utils.compact({
        campaign: this.campaign,
        month: utils.toMonth(this.month),
        amount: utils.toNumber(this.amount),
        currency: this.currency,
      }),
    });
    $.export("$summary", `Successfully added the cost of campaign '${this.campaign}'`);
    return response;
  },
};
