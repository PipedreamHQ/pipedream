import { ConfigurationError } from "@pipedream/platform";
import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-cancel-replace-order",
  name: "Spot - Trade - Cancel Replace Order",
  description: "Cancel an Existing Order and Send a New Order. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Cancel-Replace-Order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    price: {
      type: "string",
      label: "Price",
      description: "Limit price. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
    },
    size: {
      type: "string",
      label: "Amount",
      description: "It represents the number of base coins. The decimal places of amount can be got trough [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
    },
    clientOid: {
      description: "Client order ID. Either **Order ID** or **Client Order ID** is required",
      propDefinition: [
        app,
        "clientOid",
      ],
    },
    orderId: {
      description: "Order ID. Either **Order ID** or **Client Order ID** is required",
      propDefinition: [
        app,
        "orderId",
      ],
    },
    newClientOid: {
      type: "string",
      label: "New Client Order ID",
      description: "If this results in idempotency duplication, it may cause the old order to be successfully canceled but the new order placement to fail.",
      optional: true,
    },
    presetTakeProfitPrice: {
      type: "string",
      label: "Take Profit Price",
      description: "Take profit price. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    executeTakeProfitPrice: {
      type: "string",
      label: "Take Profit Execute Price",
      description: "Take profit execute price. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    presetStopLossPrice: {
      type: "string",
      label: "Stop Loss Price",
      description: "Stop loss price. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
    executeStopLossPrice: {
      type: "string",
      label: "Stop Loss Execute Price",
      description: "Stop loss execute price. The decimal places of price and the price step can be returned by the [Get Symbol Info](https://www.bitget.com/api-doc/spot/market/Get-Symbols) interface",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      price,
      size,
      clientOid,
      orderId,
      newClientOid,
      presetTakeProfitPrice,
      executeTakeProfitPrice,
      presetStopLossPrice,
      executeStopLossPrice,
    } = this;

    if (!clientOid && !orderId) {
      throw new ConfigurationError("Either **Order ID** or **Client Order ID** is required");
    }

    const response = await app.cancelReplaceSpotTradeOrder({
      $,
      data: {
        symbol,
        price,
        size,
        clientOid,
        orderId,
        newClientOid,
        presetTakeProfitPrice,
        executeTakeProfitPrice,
        presetStopLossPrice,
        executeStopLossPrice,
      },
    });

    $.export("$summary", `Successfully modified spot order for \`${symbol}\``);
    return response;
  },
};
