import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "optimoroute",
  propDefinitions: {
    afterTag: {
      type: "string",
      label: "After Tag",
      description: "Specify the after_tag to retrieve the next page of results from a previous call to this endpoint",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.optimoroute.com/v1";
    },
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
        ...opts,
      });
      if (!response.success) {
        console.log(response);
        if (response.code) {
          throw new ConfigurationError(`${response.code}: ${response.message}`);
        }
        throw new ConfigurationError(JSON.stringify(response));
      }
      return response;
    },
    getRoutes(opts = {}) {
      return this._makeRequest({
        path: "/get_routes",
        ...opts,
      });
    },
    getMobileEvents(opts = {}) {
      return this._makeRequest({
        path: "/get_events",
        ...opts,
      });
    },
    searchOrders(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search_orders",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create_order",
        ...opts,
      });
    },
    startPlanning(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/start_planning",
        ...opts,
      });
    },
    updateOrderStatus(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/update_completion_details",
        ...opts,
      });
    },
  },
};
