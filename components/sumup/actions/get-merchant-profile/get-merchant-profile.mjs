import sumup from "../../sumup.app.mjs";

export default {
  key: "sumup-get-merchant-profile",
  name: "Get Merchant Profile",
  description: "Retrieves merchant profile data. [See the documentation](https://developer.sumup.com/api/merchant/get-merchant-profile)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sumup,
  },
  async run({ $ }) {
    const response = await this.sumup.getMerchantProfile({
      $,
    });
    $.export("$summary", "Successfully retrieved merchant account data");
    return response;
  },
};
