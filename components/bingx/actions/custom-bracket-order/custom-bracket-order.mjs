import bingx from "../../bingx.app.mjs";
import lodash from "lodash";

export default {
  name: "BingX Custom Bracket Order",
  version: "0.1.1",
  key: "bingx-custom-bracket-order",
  description: "Place bracket order. [See the documentation](https://bingx-api.github.io/docs/#/swapV2/trade-api.html#Trade%20order)",
  props: {
    bingx,
    symbol: {
      default: "",
      propDefinition: [
        bingx,
        "symbol",
      ],
    },
    tradeType: {
      label: "Entry Trade Type",
      description: "Trade type for entry order only. Exit orders are always limit/stop",
      propDefinition: [
        bingx,
        "tradeType",
      ],
    },
    entrySide: {
      label: "Entry Side",
      description: "Entry direction",
      propDefinition: [
        bingx,
        "side",
      ],
    },
    exitSide: {
      label: "Exit Side",
      description: "Exit direction",
      propDefinition: [
        bingx,
        "side",
      ],
    },
    leverage: {
      propDefinition: [
        bingx,
        "leverageSide",
      ],
    },
    quantity: {
      label: "Position Size",
      description: "Position size base currency",
      type: "string",
      optional: false,
    },
    limitPrice: {
      label: "Limit Price",
      description: "Limit Price (Applicable only for limit orders)",
      type: "string",
      optional: true,
    },
    takerProfit: {
      label: "Taker Profit",
      description: "Support setting take profit while placing an order. Only supports type: TAKE_PROFIT_MARKET/TAKE_PROFIT",
      type: "string",
      optional: true,
    },
    stopLoss: {
      label: "Stop Loss",
      description: "Support setting stop loss while placing an order. Only supports type: STOP_MARKET/STOP",
      type: "string",
      optional: true,
    },
  },
  type: "action",
  methods: {
    async setLeverage() {
      const API_METHOD = "POST";
      const API_PATH = "/openApi/swap/v2/trade/leverage";
      const parametersLong = {
        "symbol": this.symbol,
        "side": "LONG",
        "leverage": this.leverage,
      };
      const parametersShort = {
        "symbol": this.symbol,
        "side": "SHORT",
        "leverage": this.leverage,
      };
      await this.bingx.makeRequest(API_METHOD, API_PATH, parametersLong);
      await this.bingx.makeRequest(API_METHOD, API_PATH, parametersShort);
    },
  },
  async run({ $ }) {
    await this.setLeverage();
    const API_METHOD = "POST";
    const API_PATH = "/openApi/swap/v2/trade/order";

    const entryParameters = lodash.pickBy({
      "symbol": this.symbol,
      "side": this.entrySide,
      "price": this.bingx.convertToFloat(this.limitPrice),
      "quantity": this.bingx.convertToFloat(this.quantity),
      "type": this.tradeType,
      "positionSide": this.leverage,
      "takerProfit": this.takerProfit,
      "stopLoss": this.stopLoss,
    });
    const entryOrder = await this.bingx.makeRequest(API_METHOD, API_PATH, entryParameters);

    const takeProfitParameters = lodash.pickBy({
      "symbol": this.symbol,
      "side": this.exitSide,
      "price": this.bingx.convertToFloat(this.targetPrice),
      "quantity": this.bingx.convertToFloat(this.quantity),
      "type": "LIMIT",
      "positionSide": this.leverage,
      "takerProfit": this.takerProfit,
      "stopLoss": this.stopLoss,
    });
    const exitOrder = await this.bingx.makeRequest(API_METHOD, API_PATH, takeProfitParameters);

    const returnValue = {
      "entryOrder": entryOrder,
      "exitOrder": exitOrder,
    };
    $.export("$summary", `Placed a bracket order for symbol ${this.symbol}`);
    return returnValue;
  },
};
