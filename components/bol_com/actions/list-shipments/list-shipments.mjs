import bolCom from "../../bol_com.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bol_com-list-shipments",
  name: "List Shipments",
  description: "List shipments. [See the documentation](https://api.bol.com/retailer/public/redoc/v10/retailer.html#tag/Shipments/operation/get-shipments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bolCom,
    page: {
      propDefinition: [
        bolCom,
        "page",
      ],
    },
    fulfilmentMethod: {
      propDefinition: [
        bolCom,
        "fulfilmentMethod",
      ],
    },
    orderId: {
      propDefinition: [
        bolCom,
        "orderId",
      ],
      description: "The ID of the order. Only valid without fulfilment-method",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.fulfilmentMethod && this.orderId) {
      throw new ConfigurationError("`Fulfilment Method` and `Order ID` cannot be used together");
    }
    const response = await this.bolCom.listShipments({
      $,
      params: {
        "page": this.page,
        "fulfilment-method": this.fulfilmentMethod,
        "order-id": this.orderId,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.shipments.length} shipment${response.shipments.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
