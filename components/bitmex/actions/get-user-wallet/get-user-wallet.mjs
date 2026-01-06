import bitmex from "../../bitmex.app.mjs";

export default {
  key: "bitmex-get-user-wallet",
  name: "Get User Wallet",
  description: "Retrieve your current wallet information from BitMEX. [See the documentation](https://www.bitmex.com/api/explorer/#!/User/User_getWallet)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bitmex,
    currency: {
      propDefinition: [
        bitmex,
        "currency",
      ],
      description: "Any currency symbol, such as \"XBt\" or \"USDt\". For all currencies specify \"all\". Defaults to \"XBt\"",
      default: "XBt",
    },
  },
  async run({ $ }) {
    const response = await this.bitmex.getUserWallet({
      currency: this.currency,
    });

    $.export("$summary", `Successfully retrieved wallet information for currency: ${this.currency}`);
    return response;
  },
};
