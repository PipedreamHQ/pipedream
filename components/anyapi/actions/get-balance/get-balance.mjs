import anyapi from "../../anyapi.app.mjs";

export default {
  key: "anyapi-get-balance",
  name: "Get Balance",
  description: "Get the remaining USD balance of your AnyAPI wallet. [See the documentation](https://getanyapi.com/docs/api-reference/get-your-wallet-balance)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    anyapi,
  },
  async run({ $ }) {
    const response = await this.anyapi.getBalance({
      $,
    });

    $.export("$summary", `Your AnyAPI balance is $${response.usd}`);
    return response;
  },
};
