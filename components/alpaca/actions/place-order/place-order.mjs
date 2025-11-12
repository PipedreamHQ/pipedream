import app from "../../alpaca.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "alpaca-place-order",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Place Order",
  description: "Places a new order for the given account. An order request may be rejected if the account is not authorized for trading, or if the tradable balance is insufficient to fill the order, [See the docs](https://alpaca.markets/docs/api-references/trading-api/orders/#request-a-new-order)",
  props: {
    app,
    isPaperAPI: {
      propDefinition: [
        app,
        "isPaperAPI",
      ],
    },
    symbol: {
      type: "string",
      label: "Symbol",
      description: "Symbol, asset ID, or currency pair to identify the asset to trade (ex. `AAPL`, `BTC/USD`).",
    },
    qty: {
      type: "string",
      label: "Qty",
      description: "Number of shares to trade. Can be fractionable for only `market` and `day` order types.",
      optional: true,
    },
    notional: {
      type: "string",
      label: "Notional",
      description: "Dollar amount to trade. Cannot work with `Qty`. Can only work for `market` order types and `day` for time in force.",
      optional: true,
    },
    side: {
      propDefinition: [
        app,
        "side",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type",
      options: [
        "market",
        "limit",
        "stop",
        "stop_limit",
        "trailing_stop",
      ],
    },
    timeInForce: {
      type: "string",
      label: "Time in Force",
      description: "Please see [this doc](https://alpaca.markets/docs/trading/orders/#time-in-force) for more info on what values are possible for what kind of orders.",
      options: [
        "day",
        "gtc",
        "opg",
        "cls",
        "ioc",
        "fok",
      ],
    },
    limitPrice: {
      type: "string",
      label: "Limit Price",
      description: "Required if type is `limit` or `stop_limit`",
      optional: true,
    },
    stopPrice: {
      type: "string",
      label: "Stop Price",
      description: "Required if type is `stop` or `stop_limit`",
      optional: true,
    },
    trailPrice: {
      type: "string",
      label: "Trail Price",
      description: "This or `trail_percent` is required if type is `trailing_stop`",
      optional: true,
    },
    trailPercent: {
      type: "string",
      label: "Trail Percent",
      description: "This or `trail_price` is required if type is `trailing_stop`",
      optional: true,
    },
    extendedHours: {
      type: "boolean",
      label: "Extended Hours",
      description: "If true, order will be eligible to execute in premarket/afterhours. Only works with `Type` **Limit** and `Time in Force` **Day**.",
      optional: true,
      default: false,
    },
  },
  async run ({ $ }) {
    if (!this.qty && !this.notional) {
      throw new ConfigurationError("Either `Qty` or `Notional` is required!");
    }
    if (this.qty && this.notional) {
      throw new ConfigurationError("`Qty` and `Notional` cannot be given at the same time!");
    }
    if ((this.type == "limit" || this.type == "stop_limit") && !this.limitPrice) {
      throw new ConfigurationError("`Limit Price` is required when `Type` is `limit` or `stop_limit`!");
    }
    if ((this.type == "stop" || this.type == "stop_limit") && !this.stopPrice) {
      throw new ConfigurationError("`Stop Price` is required when `Type` is `limit` or `stop_limit`!");
    }
    if (this.type == "trailing_stop" && !this.trailPrice && !this.trailPercent) {
      throw new ConfigurationError("`Trail Price` or `Trail Percent` is required when `Type` is `trailing_stop`!");
    }
    const response = await this.app.placeOrder({
      $,
      isPaperAPI: this.isPaperAPI,
      data: {
        symbol: this.symbol,
        qty: this.qty,
        notional: this.notional,
        side: this.side,
        type: this.type,
        time_in_force: this.timeInForce,
        limit_price: this.limitPrice,
        stop_price: this.stopPrice,
        trail_price: this.trailPrice,
        trail_percent: this.trailPercent,
        extended_hours: this.extendedHours,
      },
    });
    $.export("$summary", `Order(ID:${response.id}) has been placed.`);
    return response;
  },
};
