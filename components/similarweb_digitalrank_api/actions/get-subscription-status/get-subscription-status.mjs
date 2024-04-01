import similarweb from "../../similarweb_digitalrank_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "similarweb_digitalrank_api-get-subscription-status",
  name: "Get Subscription Status",
  description: "Returns the number of monthly data points remaining in your Similarweb account. [See the documentation](https://developers.similarweb.com/docs/digital-rank-api#section-Get-Subscription-Status)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    similarweb,
  },
  async run({ $ }) {
    const response = await this.similarweb.getSubscriptionStatus();

    const remainingDataPoints = response.headers["sw-datapoint-remaining"];
    if (!remainingDataPoints) {
      throw new Error("Could not retrieve remaining data points. Please check your Similarweb account.");
    }

    const summaryMessage = `You have ${remainingDataPoints} monthly data points remaining in your Similarweb account.`;

    $.export("$summary", summaryMessage);
    return {
      remainingDataPoints,
    };
  },
};
