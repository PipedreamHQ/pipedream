import tokportal from "../../tokportal.app.mjs";

export default {
  key: "tokportal-get-credit-balance",
  name: "Get Credit Balance",
  description: "Get the current credit balance of the workspace. Check it before **Create Bundle**, which debits credits immediately."
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
    const response = await this.tokportal.getCreditBalance({
      $,
    });
    const balance = response?.data ?? response;
    const amount = balance?.total_credits;
    $.export("$summary", amount !== undefined
      ? `Current balance: ${amount} credits`
      : "Retrieved credit balance");
    return balance;
  },
};
