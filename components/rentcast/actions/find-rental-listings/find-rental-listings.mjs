import rentcast from "../../rentcast.app.mjs";

export default {
  key: "rentcast-find-rental-listings",
  name: "Find Rental Listings",
  description: "Search for rental listings in a geographical area, or by a specific address. [See the documentation](https://developers.rentcast.io/reference/rental-listings-long-term)",
  version: "0.0.1",
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
      description: "The full address of the property, in the format of `Street, City, State, Zip`, e.g. `5500 Grand Lake Drive, San Antonio, TX, 78244`. Used to retrieve data for a specific property, or together with the `Radius` prop to search for listings in a specific area",
    },
    latitude: {
      propDefinition: [
        rentcast,
        "latitude",
      ],
      description: "The latitude of the property, e.g. `29.475962`. Use with `Radius` to search for listings in a specific area",
    },
    longitude: {
      propDefinition: [
        rentcast,
        "longitude",
      ],
      description: "The longitude of the property, e.g. `-98.351442`. Use with `Radius` to search for listings in a specific area",
    },
    radius: {
      type: "string",
      label: "Radius",
      description: "The radius of the search area in miles, with a maximum of 100.",
      optional: true,
    },
    propertyType: {
      propDefinition: [
        rentcast,
        "propertyType",
      ],
      description: "The type of the property, used to search for listings matching this criteria. [See the documentation](https://developers.rentcast.io/reference/property-types) for more information",
    },
    bedrooms: {
      propDefinition: [
        rentcast,
        "bedrooms",
      ],
      description: "The number of bedrooms, used to search for listings matching this criteria. Use `0` to indicate a studio layout",
    },
    bathrooms: {
      propDefinition: [
        rentcast,
        "bathrooms",
      ],
      description: "The number of bathrooms, used to search for listings matching this criteria. Supports fractions to indicate partial bathrooms",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The current listing status, used to search for listings matching this criteria",
      optional: true,
      options: [
        "Active",
        "Inactive",
      ],
    },
    daysOld: {
      propDefinition: [
        rentcast,
        "daysOld",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of listings to return",
      optional: true,
      min: 1,
      default: 50,
      max: 500,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The index of the first listing to return, used to paginate through large lists of results.",
      optional: true,
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
    $.export("$summary", "Successfully fetched rental listings");
    return response;
  },
};
