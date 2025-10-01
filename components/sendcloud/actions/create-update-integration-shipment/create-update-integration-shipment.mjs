import app from "../../sendcloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sendcloud-create-update-integration-shipment",
  name: "Create Or Update Integration Shipment",
  description: "Create or update an integration shipment. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/integrations/operations/create-a-integration-shipment)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    integrationId: {
      propDefinition: [
        app,
        "integrationId",
      ],
    },
    address: {
      description: "The address of the shipment.",
      propDefinition: [
        app,
        "address",
      ],
    },
    address2: {
      propDefinition: [
        app,
        "address",
      ],
      label: "Address 2",
      description: "A secondary address of the shipment.",
    },
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    createdAt: {
      propDefinition: [
        app,
        "createdAt",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    customsInvoiceNr: {
      propDefinition: [
        app,
        "customsInvoiceNr",
      ],
    },
    customsShipmentType: {
      propDefinition: [
        app,
        "customsShipmentType",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    externalOrderId: {
      propDefinition: [
        app,
        "externalOrderId",
      ],
    },
    externalShipmentId: {
      propDefinition: [
        app,
        "externalShipmentId",
      ],
    },
    houseNumber: {
      propDefinition: [
        app,
        "houseNumber",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
    },
    orderStatusId: {
      propDefinition: [
        app,
        "orderStatusId",
      ],
    },
    orderStatusMessage: {
      propDefinition: [
        app,
        "orderStatusMessage",
      ],
    },
    parcelItems: {
      propDefinition: [
        app,
        "parcelItems",
      ],
    },
    paymentStatusId: {
      propDefinition: [
        app,
        "paymentStatusId",
      ],
    },
    paymentStatusMessage: {
      propDefinition: [
        app,
        "paymentStatusMessage",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },

    shippingMethodCheckoutName: {
      propDefinition: [
        app,
        "shippingMethodCheckoutName",
      ],
    },
    telephone: {
      propDefinition: [
        app,
        "telephone",
      ],
    },
    toPostNumber: {
      propDefinition: [
        app,
        "toPostNumber",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    toServicePoint: {
      propDefinition: [
        app,
        "servicePointId",
        ({ country }) => ({
          country,
        }),
      ],
    },
    toState: {
      propDefinition: [
        app,
        "toState",
      ],
    },
    updatedAt: {
      propDefinition: [
        app,
        "updatedAt",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
      description: "The city of the shipment.",
    },
    shippingMethod: {
      propDefinition: [
        app,
        "shippingMethodId",
      ],
    },
    totalOrderValue: {
      propDefinition: [
        app,
        "totalOrderValue",
      ],
    },
    weight: {
      propDefinition: [
        app,
        "weight",
      ],
    },
    checkoutPayload: {
      propDefinition: [
        app,
        "checkoutPayload",
      ],
    },
    width: {
      type: "string",
      label: "Width",
      description: "Volumetric width (decimal string)",
      optional: true,
    },
    height: {
      type: "string",
      label: "Height",
      description: "Volumetric height (decimal string)",
      optional: true,
    },
    length: {
      type: "string",
      label: "Length",
      description: "Volumetric length (decimal string)",
      optional: true,
    },
    customDetails: {
      propDefinition: [
        app,
        "customDetails",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      integrationId,
      address,
      address2,
      city,
      companyName,
      country,
      createdAt,
      currency,
      customsInvoiceNr,
      customsShipmentType,
      email,
      externalOrderId,
      externalShipmentId,
      houseNumber,
      name,
      orderNumber,
      orderStatusId,
      orderStatusMessage,
      parcelItems,
      paymentStatusId,
      paymentStatusMessage,
      postalCode,
      shippingMethod,
      shippingMethodCheckoutName,
      telephone,
      toPostNumber,
      toServicePoint,
      toState,
      totalOrderValue,
      updatedAt,
      weight,
      checkoutPayload,
      width,
      height,
      length,
      customDetails,
    } = this;

    const response = await app.upsertIntegrationShipment({
      $,
      integrationId,
      data: {
        shipments: [
          {
            address,
            address2,
            city,
            company_name: companyName,
            country,
            created_at: createdAt,
            currency,
            customs_invoice_nr: customsInvoiceNr,
            customs_shipment_type: customsShipmentType,
            email,
            external_order_id: externalOrderId,
            external_shipment_id: externalShipmentId,
            house_number: houseNumber,
            name,
            order_number: orderNumber,
            order_status: {
              id: orderStatusId,
              message: orderStatusMessage,
            },
            parcel_items: utils.parseArray(parcelItems),
            payment_status: {
              id: paymentStatusId,
              message: paymentStatusMessage,
            },
            postal_code: postalCode,
            shipping_method: shippingMethod,
            shipping_method_checkout_name: shippingMethodCheckoutName,
            telephone,
            to_post_number: toPostNumber,
            to_service_point: toServicePoint,
            to_state: toState,
            total_order_value: totalOrderValue,
            updated_at: updatedAt,
            weight,
            checkout_payload: utils.parseJson(checkoutPayload),
            width,
            height,
            length,
            custom_details: utils.parseJson(customDetails),
          },
        ],
      },
    });

    $.export("$summary", "Successfully created or updated integration shipment");

    return response;
  },
};

