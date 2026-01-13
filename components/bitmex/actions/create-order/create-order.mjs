import bitmex from "../../bitmex.app.mjs";

export default {
  key: "bitmex-create-order",
  name: "Create Order",
  description: "Submit a new trading order in your BitMEX account. [See the documentation](https://www.bitmex.com/api/explorer/#!/Order/Order_new)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bitmex,
    symbol: {
      propDefinition: [
        bitmex,
        "symbol",
      ],
    },
    strategy: {
      type: "string",
      label: "Strategy",
      description: "Order strategy. e.g. 'OneWay', 'Long', 'Short'",
      optional: true,
    },
    side: {
      type: "string",
      label: "Side",
      description: "Order side. Valid options: Buy, Sell. Defaults to 'Buy' unless `orderQty` is negative",
      optional: true,
      options: [
        "Buy",
        "Sell",
      ],
    },
    orderQty: {
      type: "integer",
      label: "Order Quantity",
      description: "Order quantity in units of the instrument (i.e. contracts, for spot it is base currency in minor currency for spot (e.g. XBt quantity for XBT))",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "Optional limit price for 'Limit', 'StopLimit', and 'LimitIfTouched' orders",
      optional: true,
    },
    displayQty: {
      type: "integer",
      label: "Display Quantity",
      description: "Optional quantity to display in the book. Use 0 for a fully hidden order.",
      optional: true,
    },
    stopPx: {
      type: "string",
      label: "Stop Price",
      description: "Optional trigger price for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders. Use a price below the current price for stop-sell orders and buy-if-touched orders. Use `execInst` of 'MarkPrice' or 'LastPrice' to define the current price used for triggering.",
      optional: true,
    },
    clOrdID: {
      type: "string",
      label: "Client Order ID",
      description: "Optional Client Order ID. This clOrdID will come back on the order and any related executions.",
      optional: true,
    },
    clOrdLinkID: {
      type: "string",
      label: "Client Order Link ID",
      description: "Optional Client Order Link ID for contingent orders",
      optional: true,
    },
    pegOffsetValue: {
      type: "string",
      label: "Peg Offset Value",
      description: "Optional trailing offset from the current price for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders; use a negative offset for stop-sell orders and buy-if-touched orders. Optional offset from the peg price for 'Pegged' orders.",
      optional: true,
    },
    pegPriceType: {
      type: "string",
      label: "Peg Price Type",
      description: "Optional peg price type. Valid options: MarketPeg, PrimaryPeg, TrailingStopPeg",
      optional: true,
      options: [
        "MarketPeg",
        "PrimaryPeg",
        "TrailingStopPeg",
      ],
    },
    ordType: {
      type: "string",
      label: "Order Type",
      description: "Order type. Valid options: Market, Limit, Stop, StopLimit, MarketIfTouched, LimitIfTouched, Pegged. Defaults to 'Limit' when `price` is specified. Defaults to 'Stop' when `stopPx` is specified. Defaults to 'StopLimit' when `price` and `stopPx` are specified.",
      optional: true,
      default: "Limit",
      options: [
        "Market",
        "Limit",
        "Stop",
        "StopLimit",
        "MarketIfTouched",
        "LimitIfTouched",
        "Pegged",
      ],
    },
    timeInForce: {
      type: "string",
      label: "Time In Force",
      description: "Time in force. Valid options: Day, GoodTillCancel, ImmediateOrCancel, FillOrKill. Defaults to 'GoodTillCancel' for 'Limit', 'StopLimit', and 'LimitIfTouched' orders.",
      optional: true,
      options: [
        "Day",
        "GoodTillCancel",
        "ImmediateOrCancel",
        "FillOrKill",
      ],
    },
    execInst: {
      type: "string",
      label: "Execution Instructions",
      description: "Optional execution instructions. Valid options: ParticipateDoNotInitiate, AllOrNone, MarkPrice, IndexPrice, LastPrice, Close, ReduceOnly, Fixed, LastWithinMark. 'AllOrNone' instruction requires `displayQty` to be 0. 'MarkPrice', 'IndexPrice' or 'LastPrice' instruction valid for 'Stop', 'StopLimit', 'MarketIfTouched', and 'LimitIfTouched' orders. 'LastWithinMark' instruction valid for 'Stop' and 'StopLimit' with instruction 'LastPrice'. IndexPrice, LastWithMark, Close and ReduceOnly are not applicable to spot trading symbols.",
      optional: true,
    },
    contingencyType: {
      type: "string",
      label: "Contingency Type",
      description: "Optional contingency type for use with `clOrdLinkID`. Valid options: OneCancelsTheOther, OneTriggersTheOther.",
      optional: true,
      options: [
        "OneCancelsTheOther",
        "OneTriggersTheOther",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Optional order annotation. e.g. 'Take profit'",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bitmex.createOrder({
      symbol: this.symbol,
      strategy: this.strategy,
      side: this.side,
      orderQty: this.orderQty,
      price: this.price,
      displayQty: this.displayQty,
      stopPx: this.stopPx,
      clOrdID: this.clOrdID,
      clOrdLinkID: this.clOrdLinkID,
      pegOffsetValue: this.pegOffsetValue,
      pegPriceType: this.pegPriceType,
      ordType: this.ordType,
      timeInForce: this.timeInForce,
      execInst: this.execInst,
      contingencyType: this.contingencyType,
      text: this.text,
    });

    $.export("$summary", `Successfully created order${response.orderID
      ? ` with ID: ${response.orderID}`
      : ""}`);
    return response;
  },
};

