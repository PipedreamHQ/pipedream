import rentcast from "../../rentcast.app.mjs";
import { PROPERTY_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "rentcast-get-rent-estimate",
  name: "Get Rent Estimate",
  description: "Get a property rent estimate and comparable properties. [See the documentation](https://developers.rentcast.io/reference/rent-estimate-long-term)",
  version: "0.0.1",
  type: "action",
  props: {
    rentcast,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "You must specify either `Address`, or `Latitude` and `Longitude`.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The **full address** of the property, in the format of `Street, City, State, Zip`, e.g. `5500 Grand Lake Drive, San Antonio, TX, 78244`",
      optional: true,
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the property, e.g. `29.475962`",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the property, e.g. `-98.351442`",
      optional: true,
    },
    propertyType: {
      type: "string",
      label: "Property Type",
      description: "The type of the property. [See the documentation](https://developers.rentcast.io/reference/property-types) for more information",
      optional: true,
      options: PROPERTY_TYPE_OPTIONS,
    },
    bedrooms: {
      type: "integer",
      label: "Bedrooms",
      description: "The number of bedrooms in the property. Use `0` to indicate a studio layout",
      optional: true,
      min: 0,
    },
    bathrooms: {
      type: "string",
      label: "Bathrooms",
      description: "The number of bathrooms in the property. Supports fractions to indicate partial bathrooms",
      optional: true,
      min: 0,
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
      type: "integer",
      label: "Days Old",
      description: "The maximum number of days since comparable listings were last seen on the market, with a minimum of 1",
      optional: true,
      min: 1,
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
