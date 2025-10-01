import app from "../../mews.app.mjs";

export default {
  name: "Add Reservation Product",
  description: "Add a product to a reservation. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#add-reservation-product)",
  key: "mews-add-reservation-product",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    reservationId: {
      propDefinition: [
        app,
        "reservationId",
      ],
      description: "Identifier of the reservation to add the product to.",
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "Identifiers of the services for which the product is available.",
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    productId: {
      propDefinition: [
        app,
        "productId",
        ({ serviceIds }) => ({
          data: {
            ServiceIds: serviceIds,
          },
        }),
      ],
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The count of products to be added. If not specified, `1` is the default.",
      optional: true,
    },
    startUtc: {
      propDefinition: [
        app,
        "startUtc",
      ],
      description: "Start time of the product in ISO 8601 format (UTC). Eg. `2025-01-01T00:00:00Z`",
    },
    endUtc: {
      propDefinition: [
        app,
        "endUtc",
      ],
      description: "End time of the product in ISO 8601 format (UTC). Eg. `2025-01-01T00:00:00Z`",
    },
    unitAmountGrossValue: {
      type: "string",
      label: "Unit Amount - Gross Value",
      description: "Gross value of the product.",
      optional: true,
    },
    unitAmountNetValue: {
      type: "string",
      label: "Unit Amount - Net Value",
      description: "Net value of the product.",
      optional: true,
    },
    unitAmountCurrency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    unitAmountTaxCodes: {
      type: "string[]",
      label: "Unit Amount - Tax Codes",
      description: "Codes of Tax rates to be applied to the item. (Note, you can only define one tax when sending **Gross Value**. For multiple taxes, use **Net Value**)",
      optional: true,
      propDefinition: [
        app,
        "taxRate",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      reservationId,
      productId,
      startUtc,
      endUtc,
      count,
      unitAmountGrossValue,
      unitAmountNetValue,
      unitAmountCurrency,
      unitAmountTaxCodes,
    } = this;

    const response = await app.reservationsAddProduct({
      $,
      data: {
        ReservationId: reservationId,
        ProductId: productId,
        StartUtc: startUtc,
        EndUtc: endUtc,
        Count: count,
        ...(unitAmountGrossValue || unitAmountNetValue
          ? {
            UnitAmount: {
              Currency: unitAmountCurrency,
              ...(unitAmountGrossValue && {
                GrossValue: parseFloat(unitAmountGrossValue),
              }),
              ...(unitAmountNetValue && {
                NetValue: parseFloat(unitAmountNetValue),
              }),
              TaxCodes: unitAmountTaxCodes,
            },
          }
          : undefined
        ),
      },
    });

    $.export("$summary", `Successfully added product ${productId} to reservation ${reservationId}`);
    return response;
  },
};
