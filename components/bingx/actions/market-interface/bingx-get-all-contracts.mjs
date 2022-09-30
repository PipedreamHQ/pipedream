import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetAllContracts",
  version: "0.0.1",
  key: "bingx-market-get-all-contracts",
  description: "Contract Information [reference](https://bingx-api.github.io/docs/swap/market-api.html#_1-contract-information).",
  props: {
    bingx,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    let returnValue = await this.bingx.getAllMarketContracts();
    $.export("$summary", "Contract Information for Trading Pairs BingX");
    return returnValue;
  },
};
