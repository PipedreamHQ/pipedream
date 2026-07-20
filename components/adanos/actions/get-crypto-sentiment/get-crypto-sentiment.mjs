import adanos from "../../adanos.app.mjs";

export default {
  key: "adanos-get-crypto-sentiment",
  name: "Get Crypto Sentiment",
  description: "Get Reddit sentiment and attention metrics for one crypto asset. [See the documentation](https://api.adanos.org/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    adanos,
    symbol: {
      type: "string",
      label: "Crypto Symbol",
      description: "A crypto symbol such as `BTC`, `ETH`, or `SOL`.",
    },
    fromDate: {
      propDefinition: [
        adanos,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        adanos,
        "toDate",
      ],
    },
  },
  async run({ $ }) {
    const symbol = String(this.symbol).trim()
      .replace(/^\$/, "")
      .toUpperCase();
    const response = await this.adanos.getCryptoSentiment({
      $,
      symbol: this.symbol,
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
    $.export("$summary", `Retrieved Reddit sentiment for ${symbol}.`);
    return response;
  },
};
