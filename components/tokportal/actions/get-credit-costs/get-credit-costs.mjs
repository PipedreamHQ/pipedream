import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-get-credit-costs",
  name: "Get Credit Costs",
  description: "Get the effective credit price of every action (account creation per platform/country, video, warming term, ...) for this workspace."
    + " Use it to estimate the cost of **Create Bundle**."
    + " [See the documentation](https://developers.tokportal.com/credits/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tokportal,
  },
  async run({ $ }) {
    const response = await this.tokportal.getCreditCosts({
      $,
    });
    $.export("$summary", "Retrieved credit costs");
    return response?.data ?? response;
  },
};
