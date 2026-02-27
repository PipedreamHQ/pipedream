import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kiyoh",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The unique identifier for the location.",
      async options({ page }) {
        const limit = 50;
        const response = await this.getLocations({
          params: {
            dateSince: "2000-01-01",
            start: page * limit,
            limit,
          },
        });
        const locations = Array.isArray(response)
          ? response
          : (response.locations ?? []);
        return locations.map(({
          locationId: value, locationName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    reviewId: {
      type: "string",
      label: "Review ID",
      description: "The unique identifier for the review.",
    },
    tenantId: {
      type: "string",
      label: "Platform",
      description: "The review platform to use.",
      options: [
        {
          label: "Kiyoh",
          value: "98",
        },
        {
          label: "Klantenvertellen",
          value: "99",
        },
      ],
    },
  },
  methods: {
    getUrl(path) {
      const baseUrl = this.$auth.api_url;
      return `${baseUrl}/v1/publication/review${path}`;
    },
    _headers() {
      return {
        "X-Publication-Api-Token": this.$auth.api_token,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this._headers(),
        ...opts,
      });
    },
    getLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations/latest",
        ...opts,
      });
    },
    getAllReviews(opts = {}) {
      return this._makeRequest({
        path: "/external",
        ...opts,
      });
    },
    reviewChangeRequest(opts = {}) {
      return this._makeRequest({
        path: "/changerequest",
        method: "PUT",
        ...opts,
      });
    },
    reviewResponse(opts = {}) {
      return this._makeRequest({
        path: "/response",
        method: "PUT",
        ...opts,
      });
    },
  },
};
