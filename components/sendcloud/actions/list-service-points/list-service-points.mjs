import app from "../../sendcloud.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sendcloud-list-service-points",
  name: "List Service Points",
  description: "List service points. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/branches/v2/service-points/operations/list-service-points)",
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
    accessToken: {
      propDefinition: [
        app,
        "accessToken",
      ],
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
      description: "Destination address or postal code. Example: 'Stadhuisplein 10'",
      optional: true,
    },
    carrier: {
      type: "string",
      label: "Carrier Codes",
      description: "Comma-separated list of carrier codes. Example: 'postnl,dpd'",
      optional: true,
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
      optional: true,
    },
    generalShopType: {
      type: "string[]",
      label: "General Shop Type",
      description: "Single value or comma-separated values (e.g., 'servicepoint' or 'servicepoint,locker,post_office').",
      optional: true,
      options: [
        "servicepoint",
        "locker",
        "post_office",
        "carrier_depot",
      ],
    },
    houseNumber: {
      propDefinition: [
        app,
        "houseNumber",
      ],
      optional: true,
    },
    latitude: {
      propDefinition: [
        app,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        app,
        "longitude",
      ],
    },
    neLatitude: {
      propDefinition: [
        app,
        "neLatitude",
      ],
    },
    neLongitude: {
      propDefinition: [
        app,
        "neLongitude",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
      label: "Postal Code",
      description: "Postal code of the destination. Example: '5611 EM'",
      optional: true,
    },
    pudoId: {
      type: "string",
      label: "PUDO ID",
      description: "DPD-specific parameter (<= 7 characters).",
      optional: true,
    },
    radius: {
      type: "integer",
      label: "Radius (meters)",
      description: "Radius (in meter) of a bounding circle. Can be used instead of the **NE Latitude**, **NE Longitude**, **SW Latitude**, and **SW Longitude** parameters to define a bounding box. Minimum value: 100 meters. Maximum value: 50 000 meters.",
      optional: true,
    },
    shopType: {
      type: "string",
      label: "Shop Type",
      description: "Filter results by shop type.",
      optional: true,
    },
    swLatitude: {
      propDefinition: [
        app,
        "swLatitude",
      ],
    },
    swLongitude: {
      propDefinition: [
        app,
        "swLongitude",
      ],
    },
    weight: {
      type: "string",
      label: "Weight (kg)",
      description: "Parcel weight in kilograms. Certain carriers have limits per service point.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      country,
      accessToken,
      address,
      carrier,
      city,
      generalShopType,
      houseNumber,
      latitude,
      longitude,
      neLatitude,
      neLongitude,
      postalCode,
      pudoId,
      radius,
      shopType,
      swLatitude,
      swLongitude,
      weight,
    } = this;

    const response = await app.listServicePoints({
      $,
      params: {
        country,
        access_token: accessToken,
        address,
        carrier,
        city,
        ...(generalShopType
          ? {
            general_shop_type: utils.parseArray(generalShopType)?.join(","),
          }
          : undefined
        ),
        house_number: houseNumber,
        latitude,
        longitude,
        ne_latitude: neLatitude,
        ne_longitude: neLongitude,
        postal_code: postalCode,
        pudo_id: pudoId,
        radius,
        shop_type: shopType,
        sw_latitude: swLatitude,
        sw_longitude: swLongitude,
        weight,
      },
    });

    $.export("$summary", "Successfully listed service points");

    return response;
  },
};

