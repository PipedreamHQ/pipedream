import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tripadvisor_content_api",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location",
      async options({ searchQuery }) {
        const { data: resources } = await this.searchLocations({
          params: {
            searchQuery,
          },
        });
        return resources.map(({
          location_id, name,
        }) => ({
          value: location_id,
          label: name,
        }));
      },
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query to find locations",
    },
    address: {
      type: "string",
      label: "Location Address",
      description: "The address of the location",
      optional: true,
    },
    category: {
      type: "string",
      label: "Location Category",
      description: "The category of the location",
      optional: true,
      options: [
        "hotels",
        "attractions",
        "restaurants",
        "geos",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.content.tripadvisor.com/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
      });
    },
    getLocationDetails({
      locationId, ...args
    }) {
      return this._makeRequest({
        ...args,
        path: `/location/${locationId}/details`,
      });
    },
    getLocationReviews({
      locationId, ...args
    }) {
      return this._makeRequest({
        ...args,
        path: `/location/${locationId}/reviews`,
      });
    },
    searchLocations(args = {}) {
      return this._makeRequest({
        ...args,
        path: "/location/search",
      });
    },
  },
};
