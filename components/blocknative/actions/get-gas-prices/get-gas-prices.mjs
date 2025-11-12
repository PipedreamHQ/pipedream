import app from "../../blocknative.app.mjs";

export default {
  key: "blocknative-get-gas-prices",
  name: "Get Gas Prices",
  description: "Get gas price estimations with confidence levels. [See the documentation](https://docs.blocknative.com/gas-prediction/gas-platform)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    confidenceLevels: {
      propDefinition: [
        app,
        "confidenceLevels",
      ],
    },
    chainid: {
      propDefinition: [
        app,
        "chainid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getBlockprices({
      $,
      params: {
        confidenceLevels: this.confidenceLevels.join(","),
        chainid: this.chainid,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.blockPrices[0].estimatedPrices.length + " estimated prices");
    return response;
  },
};
