import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Custom Calculate Leveraged Position",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  async run({ $ }) {
    let entryPrice = this.limitPrice;
    if (!entryPrice)
      entryPrice = await this.bingx.getLatestPrice({
        params: {
          symbol: this.symbol,
        },
        $,
      });
    let tradeDirection = entryPrice > this.stopPrice
      ? "BID"
      : "ASK";
    let tpDirection = entryPrice > this.stopPrice
      ? "ASK"
      : "BID";
    const balanceQuery = await this.bingx.getBalance({
      params: {
        currency: this.currency,
      },
      $,
    });
    console.log(balanceQuery);
    if (balanceQuery.code) {
      throw new Error(balanceQuery.msg);
    }
    const balance = balanceQuery.data.balance.balance;
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
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Calculated bracket order for ${this.symbol}`);
    }
    return returnValue;
  },
};
