import bingx from "../../bingx.app.mjs";

export default {
  name: "BingX Custom BracketOrder",
  version: "0.0.2",
  key: "bingx-custom-bracket-order",
  description: "Place bracket order",
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
        "leverage",
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
    targetPrice: {
      label: "Take Profit Price",
      description: "Take Profit price for trade",
      type: "string",
      optional: false,
    },
  },
  type: "action",
  methods: {
    async setLeverage() {
      const API_METHOD = "POST";
      const API_PATH = "/api/v1/user/setLeverage";
      const parametersLong = {
        "symbol": this.symbol,
        "side": "Long",
        "leverage": this.leverage,
      };
      const parametersShort = {
        "symbol": this.symbol,
        "side": "Short",
        "leverage": this.leverage,
      };
      await this.bingx.makeRequest(API_METHOD, API_PATH, parametersLong);
      await this.bingx.makeRequest(API_METHOD, API_PATH, parametersShort);
    },
  },
  async run({ $ }) {
    await this.setLeverage();
    const API_METHOD = "POST";
    const API_PATH = "/api/v1/user/trade";

    const entryParameters = {
      "symbol": this.symbol,
      "side": this.entrySide,
      "entrustPrice": this.bingx.convertToFloat(this.limitPrice),
      "entrustVolume": this.bingx.convertToFloat(this.quantity),
      "tradeType": this.tradeType,
      "action": "Open",
    };
    const entryOrder = await this.bingx.makeRequest(API_METHOD, API_PATH, entryParameters);

    const takeProfitParameters = {
      "symbol": this.symbol,
      "side": this.exitSide,
      "entrustPrice": this.bingx.convertToFloat(this.targetPrice),
      "entrustVolume": this.bingx.convertToFloat(this.quantity),
      "tradeType": "Limit",
      "action": "Close",
    };
    console.log(takeProfitParameters);
    const exitOrder = await this.bingx.makeRequest(API_METHOD, API_PATH, takeProfitParameters);
    const returnValue = {
      "entryOrder": entryOrder,
      "exitOrder": exitOrder,
    };
    $.export("$summary", `Place a bracket order for symbol ${this.symbol}`);
    return returnValue;
  },
};
