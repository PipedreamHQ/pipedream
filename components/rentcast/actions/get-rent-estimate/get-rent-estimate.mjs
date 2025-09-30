import rentcast from "../../rentcast.app.mjs";

export default {
  key: "rentcast-get-rent-estimate",
  name: "Get Rent Estimate",
  description: "Get a property rent estimate and comparable properties. [See the documentation](https://developers.rentcast.io/reference/rent-estimate-long-term)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rentcast,
    infoAlert: {
      propDefinition: [
        rentcast,
        "infoAlert",
      ],
    },
    address: {
      propDefinition: [
        rentcast,
        "address",
      ],
    },
    latitude: {
      propDefinition: [
        rentcast,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        rentcast,
        "longitude",
      ],
    },
    propertyType: {
      propDefinition: [
        rentcast,
        "propertyType",
      ],
    },
    bedrooms: {
      propDefinition: [
        rentcast,
        "bedrooms",
      ],
    },
    bathrooms: {
      propDefinition: [
        rentcast,
        "bathrooms",
      ],
    },
    squareFootage: {
      type: "string",
      label: "Square Footage",
      description: "The total living area size of the property, in square feet",
      optional: true,
    },
    maxRadius: {
      type: "string",
      label: "Max Radius",
      description: "The maximum distance between comparable listings and the subject property, in miles",
      optional: true,
    },
    daysOld: {
      propDefinition: [
        rentcast,
        "daysOld",
      ],
    },
    compCount: {
      type: "integer",
      label: "Comparable Count",
      description: "The number of comparable listings to use when calculating the value estimate, between 5 and 25. Defaults to 15 if not provided",
      optional: true,
      min: 5,
      max: 25,
      default: 15,
    },
  },
  async run({ $ }) {
    const {
      rentcast, ...params
    } = this;
    const response = await rentcast.fetchRentEstimate({
      $,
      params,
    });
    $.export("$summary", "Successfully fetched rent estimate");
    return response;
  },
};
