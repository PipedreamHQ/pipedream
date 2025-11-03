import app from "../../billbee.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "billbee-create-order",
  name: "Create Order",
  description: "Create a new order. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_PostNewOrder)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderData: {
      type: "object",
      label: "Order Data",
      description: `The data for the order. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_PostNewOrder)

**Example:**
\`\`\`json
{
  "State": 1,
  "CreatedAt": "2025-09-04T00:00:00.000Z",
  "PaymentMethod": 1,
  "ShippingCost": 0,
  "TotalCost": 0,
  "OrderItems": [
    {
      "Product": {
        "Title": "Test 1"
      },
      "Quantity": 1,
      "TotalPrice": 0,
      "TaxAmount": 0,
      "TaxIndex": 19
    }
  ]
}
\`\`\``,
    },
  },
  async run({ $ }) {
    const {
      app,
      orderData,
    } = this;

    const response = await app.createOrder({
      $,
      data: utils.parse(orderData),
    });

    $.export("$summary", `Successfully created order with ID \`${response.Data?.BillBeeOrderId}\``);

    return response;
  },
};
