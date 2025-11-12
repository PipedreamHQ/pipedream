import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-place-order",
  name: "Spot - Trade - Place Order",
  description: "Place a spot order on Bitget. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Place-Order)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    symbol: {
      optional: false,
      propDefinition: [
        app,
        "symbol",
      ],
    },
    side: {
      type: "string",
      label: "Side",
      description: "Order direction",
      options: [
        "buy",
        "sell",
      ],
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "Order type",
      options: [
        "limit",
        "market",
      ],
      reloadProps: true,
    },
    price: {
      type: "string",
      label: "Limit Price",
      description: "The price at which the order is executed. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    size: {
      type: "string",
      label: "Amount",
      description: "For Limit and Market-Sell orders, it represents the number of base coins. For Market-Buy orders, it represents the number of quote coins. The decimal places of amount can be got trough [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
    },
    clientOid: {
      description: "Custom client order ID. It's invalid when **Spot Order Type** is **SPOT TP/SL Order**",
      optional: true,
      propDefinition: [
        app,
        "clientOid",
      ],
    },
    triggerPrice: {
      type: "string",
      label: "Trigger Price",
      description: "SPOT TP/SL trigger price, only requried in SPOT TP/SL order",
      optional: true,
    },
    tpslType: {
      propDefinition: [
        app,
        "tpslType",
      ],
    },
    requestTime: {
      propDefinition: [
        app,
        "requestTime",
      ],
    },
    receiveWindow: {
      propDefinition: [
        app,
        "receiveWindow",
      ],
    },
    stpMode: {
      type: "string",
      label: "STP Mode",
      description: "STP Mode (Self Trade Prevention)",
      optional: true,
      options: [
        {
          value: "none",
          label: "Not setting STP (default)",
        },
        {
          value: "cancel_taker",
          label: "Cancel taker order",
        },
        {
          value: "cancel_maker",
          label: "Cancel maker order",
        },
        {
          value: "cancel_both",
          label: "Cancel both of taker and maker orders",
        },
      ],
    },
    presetTakeProfitPrice: {
      type: "string",
      label: "Take Profit Price",
      description: "Take profit price. It's invalid when **Order Type** is **SPOT TP/SL Order**. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    presetStopLossPrice: {
      type: "string",
      label: "Stop Loss Price",
      description: "Stop loss price. It's invalid when **Order Type** is **SPOT TP/SL Order**. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    executeTakeProfitPrice: {
      type: "string",
      label: "Take Profit Execute Price",
      description: "Take profit execute price. It's invalid when **Order Type** is **SPOT TP/SL Order**. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    executeStopLossPrice: {
      type: "string",
      label: "Stop Loss Execute Price",
      description: "Stop loss execute price. It's invalid when **Order Type** is **SPOT TP/SL Order**. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
  },
  additionalProps() {
    if (this.orderType === "market") {
      return {};
    }
    return {
      force: {
        type: "string",
        label: "Time In Force",
        description: "Time in force for the order",
        options: [
          {
            value: "gtc",
            label: "Good Till Cancelled",
          },
          {
            value: "ioc",
            label: "Immediate Or Cancel",
          },
          {
            value: "fok",
            label: "Fill Or Kill",
          },
          {
            value: "post_only",
            label: "Post Only",
          },
        ],
      },
    };
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      side,
      orderType,
      force,
      tpslType,
      size,
      price,
      clientOid,
      triggerPrice,
      requestTime,
      receiveWindow,
      stpMode,
      presetTakeProfitPrice,
      presetStopLossPrice,
      executeTakeProfitPrice,
      executeStopLossPrice,
    } = this;

    const response = await app.placeSpotTradeOrder({
      $,
      data: {
        symbol,
        side,
        orderType,
        force,
        tpslType,
        size,
        price,
        clientOid,
        triggerPrice,
        requestTime,
        receiveWindow,
        stpMode,
        presetTakeProfitPrice,
        presetStopLossPrice,
        executeTakeProfitPrice,
        executeStopLossPrice,
      },
    });

    $.export("$summary", `Successfully placed spot order for \`${symbol}\``);
    return response;
  },
};
