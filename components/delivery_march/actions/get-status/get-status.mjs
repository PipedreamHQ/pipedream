import deliveryMarch from "../../delivery_march.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Get Status",
  description: "Return all status event details of a shipment. [See the documentation](https://engine.deliverymatch.eu/documentation#/operations/post-getStatus)",
  key: "delivery_march-get-status",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    deliveryMarch,
    shipmentId: {
      propDefinition: [
        deliveryMarch,
        "shipmentId",
      ],
    },
    orderNumber: {
      propDefinition: [
        deliveryMarch,
        "orderNumber",
      ],
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel through which the shipments have been made. Example: `shopify`",
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "The starting date for the shipment status event period. Example: `2023-01-16 15:30:11`",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "The ending date for the shipment status event period. Example: `2023-01-16 15:30:11`",
      optional: true,
    },
    isIncremental: {
      type: "boolean",
      label: "Is Incremental",
      description: "If `true`, shows which status events have been received. If `false`, all status events will be returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.shipmentId && !this.orderNumber) {
      throw new ConfigurationError("Either shipment ID or order number must be provided.");
    }
    if (this.shipmentId && this.orderNumber) {
      throw new ConfigurationError("Either shipment ID or order number must be provided, not both.");
    }
    const response = await this.deliveryMarch.getStatus({
      $,
      data: {
        shipment: {
          id: this.shipmentId,
          orderNumber: this.orderNumber,
        },
        channel: this.channel,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        isIncremental: this.isIncremental,
      },
    });
    $.export("$summary", `Successfully retrieved status for shipment \`${this.shipmentId || this.orderNumber}\`.`);
    return response;
  },
};
