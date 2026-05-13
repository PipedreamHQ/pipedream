import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-fulfillment",
  name: "Update Fulfillment",
  description: "Update an existing fulfillment. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/update)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    fulfillmentId: {
      propDefinition: [
        surecart,
        "fulfillmentId",
      ],
    },
    notificationsEnabled: {
      type: "boolean",
      label: "Notifications Enabled",
      description: "Enable or disable fulfillment notifications to the customer.",
      optional: true,
    },
    shipmentStatus: {
      type: "string",
      label: "Shipment Status",
      description: "The current shipment status for this fulfillment.",
      optional: true,
      options: [
        "unshippable",
        "unshipped",
        "label_purchased",
        "shipped",
        "in_transit",
        "delivered",
        "returned",
        "failed",
      ],
    },
    trackings: {
      type: "string",
      label: "Trackings",
      description: "Updated tracking information. Each item: `{ \"number\": \"1Z999AA1012345678\", \"url\": \"https://tracking.example.com\" }`",
      optional: true,
    },
    fulfillmentItems: {
      type: "string",
      label: "Fulfillment Items",
      description: "Updated fulfillment items. Each item: `{ \"line_item\": \"li_abc123\", \"quantity\": 1 }`",
      optional: true,
    },
    shipments: {
      type: "string",
      label: "Shipments",
      description: "Updated shipment details. Each item requires `shipping_provider` (UUID).",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Updated key-value metadata. Example: `{ \"warehouse\": \"east\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateFulfillment({
      $,
      fulfillmentId: this.fulfillmentId,
      data: {
        fulfillment: {
          notifications_enabled: this.notificationsEnabled,
          shipment_status: this.shipmentStatus,
          trackings: this.trackings
            ? JSON.parse(this.trackings)
            : undefined,
          fulfillment_items: this.fulfillmentItems
            ? JSON.parse(this.fulfillmentItems)
            : undefined,
          shipments: this.shipments
            ? JSON.parse(this.shipments)
            : undefined,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully updated fulfillment ${this.fulfillmentId}`);
    return response;
  },
};
