import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-fulfillment",
  name: "Create Fulfillment",
  description: "Create a new fulfillment for an order. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    order: {
      propDefinition: [
        surecart,
        "orderId",
      ],
    },
    fulfillmentItems: {
      type: "object[]",
      label: "Fulfillment Items",
      description: "Line items to fulfill. Each item requires `line_item` (UUID) and `quantity` (integer, must not exceed unfulfilled quantity). Example: `[{ \"line_item\": \"li_abc123\", \"quantity\": 1 }]`",
      optional: true,
    },
    trackings: {
      type: "object[]",
      label: "Trackings",
      description: "Tracking information for this fulfillment. Each item: `{ \"number\": \"1Z999AA1012345678\", \"url\": \"https://tracking.example.com\" }`",
      optional: true,
    },
    shipments: {
      type: "object[]",
      label: "Shipments",
      description: "Shipment details to create with this fulfillment. Each item requires `shipping_provider` (UUID). Optional fields: `weight`, `weight_unit` (g/kg/lb/oz), `shipping_date` (Unix timestamp), `from_contact`, `to_contact`, `dimensions`, `label_file_type` (PDF/PNG/ZPLII), `inherit_weight`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createFulfillment({
      $,
      data: {
        fulfillment: {
          order: this.order,
          fulfillment_items: this.fulfillmentItems,
          trackings: this.trackings,
          shipments: this.shipments,
        },
      },
    });
    $.export("$summary", `Successfully created fulfillment ${response.id}`);
    return response;
  },
};
