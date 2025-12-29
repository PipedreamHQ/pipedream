import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "launch27",
  propDefinitions: {
    frequencyId: {
      type: "string",
      label: "Frequency ID",
      description: "The ID of the frequency to get",
      async options() {
        const frequencies = await this.listFrequencies();
        return frequencies?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.launch27.com/latest`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listFrequencies(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/booking/frequencies",
        ...opts,
      });
    },
    listServices(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/booking/services",
        ...opts,
      });
    },
    getPolicy({
      type, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/policy/${type}`,
        ...opts,
      });
    },
    getBookingSpots(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/booking/spots",
        ...opts,
      });
    },
    getNextBookingDate({
      frequencyId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/booking/frequencies/${frequencyId}/next`,
        ...opts,
      });
    },
  },
};
