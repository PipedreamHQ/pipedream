import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mindbody",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The unique ID of the Mindbody client (member). Use **Search Clients** to look up the ID by name or email.",
    },
    locationId: {
      type: "integer",
      label: "Location ID",
      description: "The ID of the location (studio). Use **Get Site Info** to discover valid location IDs.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page. Minimum 1, maximum 1000. Defaults to 100.",
      min: 1,
      max: 1000,
      default: 100,
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip for pagination. Defaults to 0.",
      default: 0,
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Filter results on or after this date. Format: `YYYY-MM-DD` (e.g., `2026-01-01`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Filter results on or before this date. Format: `YYYY-MM-DD` (e.g., `2026-12-31`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mindbodyonline.com/public/v6";
    },
    _headers() {
      return {
        "Api-Key": this.$auth.api_key,
        "SiteId": this.$auth.site_id,
        "Authorization": `${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, method = "GET", params, data,
    } = {}) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        data,
        debug: true,
      });
    },
    getSiteInfo(opts = {}) {
      return this._makeRequest({
        path: "/site/sites",
        ...opts,
      });
    },
    listSessionTypes(opts = {}) {
      return this._makeRequest({
        path: "/site/sessiontypes",
        ...opts,
      });
    },
    listStaff(opts = {}) {
      return this._makeRequest({
        path: "/staff/staff",
        ...opts,
      });
    },
    searchClients(opts = {}) {
      return this._makeRequest({
        path: "/client/clients",
        ...opts,
      });
    },
    getClientCompleteInfo(opts = {}) {
      return this._makeRequest({
        path: "/client/clientcompleteinfo",
        ...opts,
      });
    },
    getStaffAppointments(opts = {}) {
      return this._makeRequest({
        path: "/appointment/staffappointments",
        ...opts,
      });
    },
    getClasses(opts = {}) {
      return this._makeRequest({
        path: "/class/classes",
        ...opts,
      });
    },
    addClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/client/addclient",
        ...opts,
      });
    },
    updateClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/client/updateclient",
        ...opts,
      });
    },
    addAppointment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/appointment/addappointment",
        ...opts,
      });
    },
    updateAppointment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/appointment/updateappointment",
        ...opts,
      });
    },
    getClientVisits(opts = {}) {
      return this._makeRequest({
        path: "/client/clientvisits",
        ...opts,
      });
    },
    getClientPurchases(opts = {}) {
      return this._makeRequest({
        path: "/client/clientpurchases",
        ...opts,
      });
    },
  },
};
