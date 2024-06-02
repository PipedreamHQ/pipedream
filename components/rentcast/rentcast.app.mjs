import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rentcast",
  propDefinitions: {
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "A valid 5-digit US zip code",
    },
    propertyType: {
      type: "string",
      label: "Property Type",
      description: "The type of property to fetch data for. This refines the search to a specific type of property.",
      optional: true,
      options: [
        {
          label: "Single Family",
          value: "Single Family",
        },
        {
          label: "Condo",
          value: "Condo",
        },
        {
          label: "Townhouse",
          value: "Townhouse",
        },
        {
          label: "Manufactured",
          value: "Manufactured",
        },
        {
          label: "Multi-Family",
          value: "Multi-Family",
        },
        {
          label: "Apartment",
          value: "Apartment",
        },
        {
          label: "Land",
          value: "Land",
        },
      ],
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "The ID of the property to fetch a rent estimate and comparable properties for.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date to fetch the rent estimate for. Format: YYYY-MM-DD",
      optional: true,
    },
    geoLocation: {
      type: "object",
      label: "Geographical Location",
      description: "The geographical location to find rental listings in. Format: latitude,longitude",
    },
    searchCriteria: {
      type: "object",
      label: "Search Criteria",
      description: "The criteria to filter rental listings by.",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The preferred sort order of the listings.",
      optional: true,
      options: [
        {
          label: "Price: Low to High",
          value: "price_asc",
        },
        {
          label: "Price: High to Low",
          value: "price_desc",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rentcast.io/v1";
    },
    async _makeRequest({
      $ = this, headers,
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          "Content-Type": "application/json",
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async fetchRentalStatistics(args) {
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
    async findRentalListings({
      geoLocation, searchCriteria, sortBy,
    }) {
      return this._makeRequest({
        path: "/listings/rental/long-term",
        params: {
          ...geoLocation,
          ...searchCriteria,
          sortBy,
        },
      });
    },
  },
};
