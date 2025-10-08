import app from "../../billbee.app.mjs";

export default {
  key: "billbee-add-shipment-to-order",
  name: "Add Shipment To Order",
  description: "Add a shipment to an existing order. [See the documentation](https://app.billbee.io//swagger/ui/index#/Orders/OrderApi_AddShipment)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
      ],
    },
    shippingProviderId: {
      propDefinition: [
        app,
        "shippingProviderId",
      ],
    },
    shippingProviderProductId: {
      label: "Shipping Provider Product ID",
      description: "The ID of the shipping provider product/service",
      propDefinition: [
        app,
        "shipment",
        ({
          orderId, shippingProviderId,
        }) => ({
          orderId,
          shippingProviderId,
          mapper: ({ ShippingProviderProductId: value }) => value,
        }),
      ],
    },
    shippingId: {
      label: "Shipping ID",
      description: "The ID of the shipment",
      propDefinition: [
        app,
        "shipment",
        ({
          orderId, shippingProviderId,
        }) => ({
          orderId,
          shippingProviderId,
          mapper: ({ ShippingId: value }) => value,
        }),
      ],
    },
    carrierId: {
      propDefinition: [
        app,
        "carrierId",
      ],
    },
    shipmentType: {
      propDefinition: [
        app,
        "shipmentType",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Additional comment for the shipment",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      orderId,
      shippingProviderId,
      shippingProviderProductId,
      comment,
      shippingId,
      carrierId,
      shipmentType,
    } = this;

    await app.addShipmentToOrder({
      $,
      orderId,
      data: {
        ShippingProviderId: shippingProviderId,
        ShippingProviderProductId: shippingProviderProductId,
        Comment: comment,
        ShippingId: shippingId,
        CarrierId: carrierId,
        ShipmentType: shipmentType,
      },
    });

    $.export("$summary", `Successfully added shipment to order \`${orderId}\``);

    return {
      success: true,
    };
  },
};
