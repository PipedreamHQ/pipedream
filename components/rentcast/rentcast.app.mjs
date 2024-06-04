import { axios } from "@pipedream/platform";
import { PROPERTY_TYPE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "rentcast",
  propDefinitions: {
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "A valid 5-digit US zip code",
    },
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
  },
  methods: {
    _baseUrl() {
      return "https://api.rentcast.io/v1";
    },
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "accept": "application/json",
          "X-Api-Key": `${this.$auth.api_key}`,
        },
        ...args,
      });
    },
    async getMarketStatistics(args) {
      return this._makeRequest({
        url: "/markets",
        ...args,
      });
    },
    async fetchRentEstimate(args) {
      return this._makeRequest({
        url: "/avm/rent/long-term",
        ...args,
      });
    },
    async findRentalListings(args) {
      return this._makeRequest({
        url: "/listings/rental/long-term",
        ...args,
      });
    },
  },
};
