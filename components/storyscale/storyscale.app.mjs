import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "storyscale",
  propDefinitions: {
    tourName: {
      type: "string",
      label: "Tour Name",
      description: "Name of the tour",
      required: true,
    },
    tourDateTime: {
      type: "string",
      label: "Tour Date and Time",
      description: "Date and time of the tour",
      optional: true,
    },
    publishedTimestamp: {
      type: "string",
      label: "Published Timestamp",
      description: "Timestamp when the tour gets published",
      optional: true,
    },
    viewerId: {
      type: "string",
      label: "Viewer ID or Username",
      description: "ID or username of the viewer",
      required: true,
    },
    viewingTimestamp: {
      type: "string",
      label: "Viewing Timestamp",
      description: "Timestamp when the tour is viewed",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://prodapi.storyscale.com/api";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/analytics/events/create",
        ...opts,
      });
    },
    async publishEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/analytics/tour/global-tour-contact-insights",
        ...opts,
      });
    },
    async viewEvent(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/v1/tour/share/view/${opts.viewerId}/${opts.tourName}`,
        params: {
          viewingTimestamp: opts.viewingTimestamp,
        },
      });
    },
  },
};
