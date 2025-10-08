import app from "../../similarweb_digitalrank_api.app.mjs";

export default {
  key: "similarweb_digitalrank_api-get-subscription-status",
  name: "Get Subscription Status",
  description: "Returns the number of monthly data points remaining in your Similarweb account. [See the documentation](https://developers.similarweb.com/docs/digital-rank-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getSubscriptionStatus({
      $,
    });

    $.export("$summary", `You have ${response.user_remaining} monthly data points remaining in your Similarweb account.`);

    return response;
  },
};
