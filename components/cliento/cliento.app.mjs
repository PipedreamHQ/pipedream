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
      async options() {
        const { resources } = await this.fetchRefData();
        return resources?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "The IDs of the services for the booking",
      async options() {
        const { services } = await this.fetchRefData();
        return services?.map(({
          serviceId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://cliento.com/api/v2/partner/cliento/${this.$auth.account_id}`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Accept: "application/json",
        },
      });
    },
    fetchSettings(opts = {}) {
      return this._makeRequest({
        path: "/settings/",
        ...opts,
      });
    },
    fetchRefData(opts = {}) {
      return this._makeRequest({
        path: "/ref-data/",
        ...opts,
      });
    },
    fetchSlots(opts = {}) {
      return this._makeRequest({
        path: "/resources/slots",
        ...opts,
      });
    },
  },
};
