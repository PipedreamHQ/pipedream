import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-shipping-options",
  name: "Get Home Delivery Shipping Options",
  description: "Contains shipping options for your checkout page. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipping%20options/shippingOptionsUsingPOST)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    consigneeCountryCode: {
      propDefinition: [
        app,
        "consigneeCountryCode",
      ],
    },
    consigneePostalCode: {
      propDefinition: [
        app,
        "consigneePostalCode",
      ],
    },
    consignorCountryCode: {
      propDefinition: [
        app,
        "consignorCountryCode",
      ],
    },
    consignorPostalCode: {
      propDefinition: [
        app,
        "consignorPostalCode",
      ],
    },
    locale: {
      propDefinition: [
        app,
        "locale",
      ],
    },
    timeZone: {
      propDefinition: [
        app,
        "timeZone",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    numberOfProcessingDays: {
      propDefinition: [
        app,
        "numberOfProcessingDays",
      ],
    },
    includeExternalDeliveryDates: {
      propDefinition: [
        app,
        "includeExternalDeliveryDates",
      ],
    },
    deliveryDateStartDate: {
      propDefinition: [
        app,
        "deliveryDateStartDate",
      ],
    },
    deliveryDateNumberOfDays: {
      propDefinition: [
        app,
        "deliveryDateNumberOfDays",
      ],
    },
    token: {
      propDefinition: [
        app,
        "token",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    sortOrderBy: {
      propDefinition: [
        app,
        "sortOrderBy",
      ],
    },
    sortOrder: {
      propDefinition: [
        app,
        "sortOrder",
      ],
    },
    sortDistributor: {
      propDefinition: [
        app,
        "sortDistributor",
      ],
    },
    totalWeight: {
      propDefinition: [
        app,
        "totalWeight",
      ],
    },
    totalPrice: {
      propDefinition: [
        app,
        "totalPrice",
      ],
    },
    totalVolume: {
      propDefinition: [
        app,
        "totalVolume",
      ],
    },
    numberOfGoods: {
      propDefinition: [
        app,
        "numberOfGoods",
      ],
    },
    startMatrix: {
      propDefinition: [
        app,
        "startMatrix",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      consigneeCountryCode,
      consigneePostalCode,
      consignorCountryCode,
      consignorPostalCode,
      locale,
      timeZone,
      limit,
      numberOfProcessingDays,
      includeExternalDeliveryDates,
      token,
      tags,
      sortOrderBy,
      sortOrder,
      sortDistributor,
      totalWeight,
      totalPrice,
      totalVolume,
      numberOfGoods,
      startMatrix,
      deliveryDateStartDate,
      deliveryDateNumberOfDays,
    } = this;

    const response = await app.getShippingOptions({
      $,
      data: {
        consigneeCountryCode,
        consigneePostalCode,
        consignorCountryCode,
        consignorPostalCode,
        locale,
        timeZone,
        limit,
        numberOfProcessingDays,
        includeExternalDeliveryDates,
        token,
        tags,
        ...(deliveryDateStartDate
          || deliveryDateNumberOfDays
          ? {
            deliveryDateOptions: {
              startDate: deliveryDateStartDate,
              numberOfDays: deliveryDateNumberOfDays,
            },
          }
          : {}
        ),
        ...(sortOrderBy
          || sortOrder
          || sortDistributor
          ? {
            sortingModel: {
              orderBy: sortOrderBy,
              sortOrder: sortOrder,
              distributor: sortDistributor,
            },
          }
          : {}
        ),
        ...(totalWeight
          || totalPrice
          || totalVolume
          || numberOfGoods
          || startMatrix
          ? {
            shipmentParameters: {
              totalWeight: totalWeight
                ? parseFloat(totalWeight)
                : undefined,
              totalPrice: totalPrice
                ? parseFloat(totalPrice)
                : undefined,
              totalVolume: totalVolume
                ? parseFloat(totalVolume)
                : undefined,
              numberOfGoods,
              startMatrix: startMatrix,
            },
          }
          : {}
        ),
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.shippingOptions?.length || 0}\` shipping options`);
    return response;
  },
};
