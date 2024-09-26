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
    maxListings: {
      type: "integer",
      label: "Max Listings",
      description: "The maximum number of listings to return. Each API call can retrieve up to `500` listings, so a higher amount will require multiple requests.",
      optional: true,
      min: 1,
      default: 50,
      max: 2000,
    },
  },
  async run({ $ }) {
    let {
      rentcast, maxListings,  ...params
    } = this;

    const totalItems = [];
    let offset = 0;
    do {
      const limit = Math.min(maxListings, 500);
      const response = await rentcast.findRentalListings({
        $,
        params: {
          ...params,
          limit,
          offset,
        },
      });
      const length = response?.length;
      if (!length) {
        break;
      }
      totalItems.push(...response.slice(0, maxListings));
      offset += length;
      maxListings -= length;
    } while (maxListings > 0);

    $.export("$summary", `Successfully fetched ${totalItems.length} rental listings`);
    return totalItems;
  },
};
