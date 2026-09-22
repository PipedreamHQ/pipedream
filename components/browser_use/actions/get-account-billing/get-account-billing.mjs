import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-account-billing",
  name: "Get Account Billing",
  description: "Get Browser Use account billing details for the authenticated project. [See the documentation](https://docs.browser-use.com/cloud/api-v3/billing/get-account-billing)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
  },
  async run({ $ }) {
    const response = await this.browserUse.getAccountBilling({
      $,
    });

    $.export("$summary", "Retrieved Browser Use account billing details");
    return response;
  },
};
