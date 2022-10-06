import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Market GetAllContracts",
  version: "0.0.3",
  key: "bingx-market-get-all-contracts",
  description: "Contract Information [reference](https://bingx-api.github.io/docs/swap/market-api.html#_1-contract-information).",
  props: {
    bingx,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const API_METHOD = "GET";
    const API_PATH = "/api/v1/market/getAllContracts";
    const parameters = {};
    let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    $.export("$summary", "Contract Information for Trading Pairs BingX");
    return returnValue;
  },
};
