import app from "../../paazl.app.mjs";

export default {
  key: "paazl-get-pickup-location-options",
  name: "Get Pickup Location Shipping Options",
  description: "Contains pickup locations for your checkout page. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Shipping%20options/getPickupLocationsUsingPOST)",
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
      optional: false,
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
    network: {
      propDefinition: [
        app,
        "network",
      ],
    },
    crossBorderStores: {
      propDefinition: [
        app,
        "crossBorderStores",
      ],
    },
    excludeLockers: {
      propDefinition: [
        app,
        "excludeLockers",
      ],
    },
    lockersOnly: {
      propDefinition: [
        app,
        "lockersOnly",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
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
      network,
      crossBorderStores,
      excludeLockers,
      lockersOnly,
      tags,
      totalWeight,
      totalPrice,
      totalVolume,
      numberOfGoods,
      startMatrix,
      deliveryDateStartDate,
      deliveryDateNumberOfDays,
    } = this;

    const response = await app.getPickupLocationOptions({
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
        network,
        crossBorderStores,
        excludeLockers,
        lockersOnly,
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
              startMatrix,
            },
          }
          : {}
        ),
      },
    });

    $.export("$summary", `Successfully retrieved \`${response.pickupLocations?.length || 0}\` pickup location options`);
    return response;
  },
};
