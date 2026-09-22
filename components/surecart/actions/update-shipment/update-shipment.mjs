import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-shipment",
  name: "Update Shipment",
  description: "Update an existing shipment. [See the documentation](https://developer.surecart.com/api-reference/shipments/update)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    shipmentId: {
      propDefinition: [
        surecart,
        "shipmentId",
      ],
    },
    labelFileType: {
      type: "string",
      label: "Label File Type",
      description: "Format of the shipping label to generate.",
      optional: true,
      options: [
        "PDF",
        "PDF_A4",
        "PDF_A6",
        "PDF_4x6",
        "PDF_4x8",
        "PNG",
        "ZPLII",
      ],
    },
    parcelTemplate: {
      type: "string",
      label: "Parcel Template ID",
      description: "UUID of a parcel template to use for dimensions and weight. Example: `pt_abc123`",
      optional: true,
    },
    weight: {
      type: "string",
      label: "Weight",
      description: "Weight of the shipment as a string. Example: `2.5`",
      optional: true,
    },
    weightUnit: {
      type: "string",
      label: "Weight Unit",
      description: "Unit for the weight value.",
      optional: true,
      options: [
        "g",
        "kg",
        "lb",
        "oz",
      ],
    },
    inheritWeight: {
      type: "boolean",
      label: "Inherit Weight",
      description: "Automatically calculate weight from the fulfillment items.",
      optional: true,
    },
    shippingDate: {
      type: "integer",
      label: "Shipping Date (Unix timestamp)",
      description: "Scheduled ship date as a Unix timestamp. Example: `1700000000`",
      optional: true,
    },
    dimensions: {
      type: "object",
      label: "Dimensions",
      description: "Package dimensions object with `length`, `width`, `height`, and `unit`. Example: `{ \"length\": 10, \"width\": 8, \"height\": 4, \"unit\": \"in\" }`",
      optional: true,
    },
    fulfillment: {
      propDefinition: [
        surecart,
        "fulfillmentId",
      ],
    },
    shippingProvider: {
      type: "string",
      label: "Shipping Provider ID",
      description: "UUID of the shipping provider to use. Example: `sp_abc123`",
      optional: true,
    },
    fromContact: {
      type: "object",
      label: "From Contact",
      description: "Origin address details. Example: `{ \"name\": \"Sender\", \"street1\": \"123 Main St\", \"city\": \"New York\", \"state\": \"NY\", \"zip\": \"10001\", \"country\": \"US\" }`",
      optional: true,
    },
    toContact: {
      type: "object",
      label: "To Contact",
      description: "Destination address details. Example: `{ \"name\": \"Recipient\", \"street1\": \"456 Oak Ave\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zip\": \"90001\", \"country\": \"US\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateShipment({
      $,
      shipmentId: this.shipmentId,
      data: {
        shipment: {
          label_file_type: this.labelFileType,
          parcel_template: this.parcelTemplate,
          weight: this.weight,
          weight_unit: this.weightUnit,
          inherit_weight: this.inheritWeight,
          shipping_date: this.shippingDate,
          dimensions: this.dimensions,
          fulfillment: this.fulfillment,
          shipping_provider: this.shippingProvider,
          from_contact: this.fromContact,
          to_contact: this.toContact,
        },
      },
    });
    $.export("$summary", `Successfully updated shipment ${this.shipmentId}`);
    return response;
  },
};
