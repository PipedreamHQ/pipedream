import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Custom Calculate Leveraged Position",
  version: "0.0.3",
  key: "bingx-custom-calculate-leveraged-position",
  description: "Calculate leveraged position based on entry, stop price and account balance",
  props: {
    bingx,
    symbol: {
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    currency: {
      propDefinition: [
        bingx,
        "currency",
      ],
    },
    tradeType: {
      propDefinition: [
        bingx,
        "tradeType",
      ],
    },
    limitPrice: {
      label: "Limit Price",
      description: "Limit Price (Applicable only for limit orders)",
      type: "string",
      optional: true,
    },
    stopPrice: {
      label: "Stop Loss Price",
      description: "Stop Loss Price for trade",
      type: "string",
      optional: false,
    },
    profitPrice: {
      label: "Take Profit Loss Price",
      description: "Take Profit Price for trade",
      type: "string",
      optional: false,
    },
    riskOnCapital: {
      label: "Risk",
      description: "Risk Percentage of capital",
      type: "string",
      default: "2",
      optional: false,
    },
  },
  type: "action",
  methods: {
    async getBalance() {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/getBalance";
      const parameters = {
        "currency": this.currency,
      };
      return this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
    },
    async getLatestPrice() {
      const API_METHOD = "GET";
      const API_PATH = "/api/v1/market/getLatestPrice";
      const parameters = {
        "symbol": this.symbol,
      };
      let returnValue = await this.bingx.makeRequest(API_METHOD, API_PATH, parameters);
      return returnValue.data.indexPrice;
    },
  },
  async run({ $ }) {
    let entryPrice = this.limitPrice;
    if (!entryPrice)
      entryPrice = await this.getLatestPrice();
    let tradeDirection = entryPrice > this.stopPrice
      ? "Bid"
      : "Ask";
    let tpDirection = entryPrice > this.stopPrice
      ? "Ask"
      : "Bid";
    const balanceQuery = await this.getBalance();
    console.log(balanceQuery);
    if (balanceQuery.code) {
      throw new Error(balanceQuery.msg);
    }
    const balance = balanceQuery.data.account.balance;
    const risk = this.bingx.convertToFloat(this.riskOnCapital) * balance / 100;

    const stopDiff = Math.abs(entryPrice - this.stopPrice);
    const profitDiff = Math.abs(entryPrice - this.profitPrice);

    const leverage = Math.floor(entryPrice * 0.9 / stopDiff);
    const qty = risk / stopDiff;
    const profit = qty * profitDiff;
    const returnValue = {
      "entryPrice": entryPrice,
      "stopPrice": this.stopPrice,
      "targetPrice": this.profitPrice,
      "entryDirection": tradeDirection,
      "exitDirection": tpDirection,
      "leverage": leverage,
      "quantity": qty,
      "riskAmount": risk,
      "profitAmount": profit,
      "riskReward": profit / risk,
    };
    $.export("$summary", `Calculate bracket order for ${this.symbol}`);
    return returnValue;
  },
};
