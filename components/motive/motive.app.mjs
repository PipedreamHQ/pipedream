import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "motive",
  version: "0.0.{{ts}}",
  propDefinitions: {
    driverId: {
      type: "string",
      label: "Driver ID",
      description: "Filter to a specific driver",
      optional: true,
    },
    safetyCategory: {
      type: "string",
      label: "Safety Category",
      description: "Filter to a specific safety category",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Username to retrieve user details",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email to retrieve user details",
      optional: true,
    },
    driverCompanyId: {
      type: "string",
      label: "Driver Company ID",
      description: "Driver company ID to retrieve user details",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number to retrieve user details",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.gomotive.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listHosViolations(opts = {}) {
      const params = {};
      if (opts.driverId) params.driver_id = opts.driverId;
      return this._makeRequest({
        method: "GET",
        path: "/hos_violations",
        params,
        ...opts,
      });
    },
    async listDriverPerformanceEvents(opts = {}) {
      const params = {};
      if (opts.safetyCategory) params.safety_category = opts.safetyCategory;
      return this._makeRequest({
        method: "GET",
        path: "/driver_performance_events",
        params,
        ...opts,
      });
    },
    async retrieveUserDetails(opts = {}) {
      const {
        username, email, driverCompanyId, phone, ...otherOpts
      } = opts;
      const queryParams = {};
      if (username) queryParams.username = username;
      if (email) queryParams.email = email;
      if (driverCompanyId) queryParams.driver_company_id = driverCompanyId;
      if (phone) queryParams.phone = phone;

      return this._makeRequest({
        method: "GET",
        path: "/users/lookup",
        params: queryParams,
        ...otherOpts,
      });
    },
    async paginate(fn, ...args) {
      const results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          ...args,
          page,
        });
        if (!Array.isArray(response) || response.length === 0) {
          hasMore = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }

      return results;
    },
  },
};
