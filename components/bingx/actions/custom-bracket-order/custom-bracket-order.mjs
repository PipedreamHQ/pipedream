import bingx from "../../bingx.app.mjs";
import lodash from "lodash";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "BingX Custom Bracket Order",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    targetPrice: {
      label: "Take Profit Price",
      description: "Take Profit price for trade",
      type: "string",
      optional: true,
    },
  },
  type: "action",
  methods: {
    async setLeverage($) {
      await this.bingx.setLeverage({
        params: {
          symbol: this.symbol,
          side: "LONG",
          leverage: this.leverage,
        },
        $,
      });
      await this.bingx.setLeverage({
        params: {
          symbol: this.symbol,
          side: "SHORT",
          leverage: this.leverage,
        },
        $,
      });
    },
  },
  async run({ $ }) {
    if (this.tradeType === "LIMIT" && !(this.limitPrice && this.targetPrice)) {
      throw new ConfigurationError("Limit Price and Take Profit Price are required for trade type `LIMIT`.");
    }

    await this.setLeverage($);

    const entryParameters = lodash.pickBy({
      "symbol": this.symbol,
      "side": this.entrySide,
      "price": this.bingx.convertToFloat(this.limitPrice),
      "quantity": this.bingx.convertToFloat(this.quantity),
      "type": this.tradeType,
      "positionSide": this.leverage,
    });
    const entryOrder = await this.bingx.createOrder({
      params: entryParameters,
      $,
    });

    const takeProfitParameters = lodash.pickBy({
      "symbol": this.symbol,
      "side": this.exitSide,
      "price": this.bingx.convertToFloat(this.targetPrice),
      "quantity": this.bingx.convertToFloat(this.quantity),
      "type": "LIMIT",
      "positionSide": this.leverage,
    });
    const exitOrder = await this.bingx.createOrder({
      params: takeProfitParameters,
      $,
    });

    const returnValue = {
      "entryOrder": entryOrder,
      "exitOrder": exitOrder,
    };
    if (returnValue.code) {
      throw new Error(returnValue.msg);
    } else {
      $.export("$summary", `Placed a bracket order for symbol ${this.symbol}`);
    }
    return returnValue;
  },
};
