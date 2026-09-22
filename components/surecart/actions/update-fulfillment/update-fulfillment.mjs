import surecart from "../../surecart.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "surecart-update-fulfillment",
  name: "Update Fulfillment",
  description: "Update an existing fulfillment. [See the documentation](https://developer.surecart.com/api-reference/fulfillments/update)",
  version: "0.0.3",
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
      description: "Updated tracking information as a JSON array. Example: `[{ \"number\": \"1Z999AA1012345678\", \"url\": \"https://tracking.example.com\" }]`",
      optional: true,
    },
    fulfillmentItems: {
      type: "string",
      label: "Fulfillment Items",
      description: "Updated fulfillment items as a JSON array. Example: `[{ \"line_item\": \"li_abc123\", \"quantity\": 1 }]`",
      optional: true,
    },
    shipments: {
      type: "string",
      label: "Shipments",
      description: "Updated shipment details. Each item requires `shipping_provider` (UUID). Example: `[{\"shipping_provider\":\"sp_abc123\",\"tracking_number\":\"1Z999AA1012345678\",\"items\":[{\"line_item\":\"li_xyz789\",\"quantity\":1}]}]`",
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
    if (
      this.notificationsEnabled === undefined
      && this.shipmentStatus === undefined
      && this.trackings === undefined
      && this.fulfillmentItems === undefined
      && this.shipments === undefined
      && this.metadata === undefined
    ) {
      throw new ConfigurationError("At least one of the following parameters must be provided: `Notifications Enabled`, `Shipment Status`, `Trackings`, `Fulfillment Items`, `Shipments`, `Metadata`");
    }

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
