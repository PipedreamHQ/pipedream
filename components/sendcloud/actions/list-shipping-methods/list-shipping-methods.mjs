import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-shipping-methods",
  name: "List Shipping Methods",
  description: "List shipping methods. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/shipping-methods/operations/list-shipping-methods)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    servicePointId: {
      propDefinition: [
        app,
        "servicePointId",
        ({ country }) => ({
          country,
        }),
      ],
      optional: true,
    },
    fromPostalCode: {
      type: "string",
      label: "From Postal Code",
      description: "Postal code of the sender (<= 12 chars). Required if the carrier is zonal.",
      optional: true,
    },
    isReturn: {
      type: "boolean",
      label: "Is Return",
      description: "If true, returns shipping methods usable for return shipments.",
      optional: true,
    },
    senderAddress: {
      description: "Sender address ID or `all` to retrieve all available shipping methods. Required if the carrier is zonal.",
      optional: true,
      propDefinition: [
        app,
        "senderAddress",
      ],
    },
    toCountry: {
      propDefinition: [
        app,
        "country",
      ],
      label: "To Country",
      description: "Recipient country (ISO 3166-1 alpha-2). Required if the carrier is zonal and to compute remote surcharges.",
      optional: true,
    },
    toPostalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
      label: "To Postal Code",
      description: "Postal code of the recipient (<= 12 chars). Required if the carrier is zonal and to compute remote surcharges.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      fromPostalCode,
      isReturn,
      senderAddress,
      servicePointId,
      toCountry,
      toPostalCode,
    } = this;

    const response = await app.listShippingMethods({
      $,
      params: {
        from_postal_code: fromPostalCode,
        is_return: isReturn,
        sender_address: senderAddress,
        service_point_id: servicePointId,
        to_country: toCountry,
        to_postal_code: toPostalCode,
      },
    });

    $.export("$summary", "Successfully listed shipping methods");

    return response;
  },
};

