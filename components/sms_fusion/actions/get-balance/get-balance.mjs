import smsFusion from "../../sms_fusion.app.mjs";

export default {
  key: "sms_fusion-get-balance",
  name: "Get Balance",
  description: "Get current account balance including credit limits in SMS Fusion. [See the documentation](https://docs.smsfusion.com.au/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    smsFusion,
  },
  async run({ $ }) {
    const response = await this.smsFusion.getBalance({
      $,
    });
    $.export("$summary", "Successfully retrieved account balance");
    return response;
  },
};
