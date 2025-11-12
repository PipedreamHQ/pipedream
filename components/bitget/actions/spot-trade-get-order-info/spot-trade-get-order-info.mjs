import { ConfigurationError } from "@pipedream/platform";
import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-get-order-info",
  name: "Spot - Trade - Get Order Info",
  description: "Retrieve detailed information about a specific order on Bitget. You can query by orderId or clientOid. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Get-Order-Info)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    orderId: {
      description: "Order ID to query (either **Order ID** or **Client Order ID** is required)",
      propDefinition: [
        app,
        "orderId",
      ],
    },
    clientOid: {
      description: "Client Order ID to query (either **Order ID** or **Client Order ID** is required)",
      propDefinition: [
        app,
        "clientOid",
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
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      clientOid,
      requestTime,
      receiveWindow,
    } = this;

    if (!orderId && !clientOid) {
      throw new ConfigurationError("Either **Order ID** or **Client Order ID** is required");
    }

    const response = await app.getSpotTradeOrderInfo({
      $,
      params: {
        orderId,
        clientOid,
        requestTime,
        receiveWindow,
      },
    });

    $.export("$summary", "Successfully retrieved order info");
    return response;
  },
};
