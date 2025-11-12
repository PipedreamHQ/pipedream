import { ConfigurationError } from "@pipedream/platform";
import app from "../../bitget.app.mjs";

export default {
  key: "bitget-spot-trade-cancel-order",
  name: "Spot - Trade - Cancel Order",
  description: "Cancel a spot order on Bitget. You can cancel by orderId or clientOid. [See the documentation](https://www.bitget.com/api-doc/spot/trade/Cancel-Order)",
  version: "0.0.4",
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
    tpslType: {
      propDefinition: [
        app,
        "tpslType",
      ],
    },
    orderId: {
      description: "Order ID to cancel (either **Order ID** or **Client Order ID** is required)",
      propDefinition: [
        app,
        "orderId",
      ],
    },
    clientOid: {
      description: "Client Order ID to cancel (either **Order ID** or **Client Order ID** is required)",
      propDefinition: [
        app,
        "clientOid",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      symbol,
      tpslType,
      orderId,
      clientOid,
    } = this;

    if (!orderId && !clientOid) {
      throw new ConfigurationError("Either **Order ID** or **Client Order ID** is required");
    }

    const response = await app.cancelSpotTradeOrder({
      $,
      data: {
        symbol,
        tpslType,
        orderId,
        clientOid,
      },
    });

    $.export("$summary", `Successfully cancelled spot order \`${orderId || clientOid}\` for \`${symbol}\``);
    return response;
  },
};
