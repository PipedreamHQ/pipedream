import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cliento",
  propDefinitions: {
    fromDate: {
      type: "string",
      label: "From Date",
      description: "The start date for the booking period (format: YYYY-MM-DD)",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "The end date for the booking period (format: YYYY-MM-DD)",
    },
    resourceIds: {
      type: "string[]",
      label: "Resource IDs",
      description: "The IDs of the resources for the booking",
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "The IDs of the services for the booking",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cliento.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async fetchSettings() {
      return this._makeRequest({
        path: "/settings/",
      });
    },
    async fetchRefData() {
      return this._makeRequest({
        path: "/ref-data/",
      });
    },
    async fetchSlots({
      fromDate, toDate, resourceIds, serviceIds,
    }) {
      const params = {
        fromDate,
        toDate,
        resIds: resourceIds.join(","),
        srvIds: serviceIds.join(","),
      };
      return this._makeRequest({
        path: "/resources/slots",
        params,
      });
    },
  },
};
