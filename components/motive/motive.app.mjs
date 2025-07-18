import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "motive",
  propDefinitions: {
    driverId: {
      type: "string",
      label: "Driver ID",
      description: "Filter to a specific driver",
    },
    safetyCategory: {
      type: "string",
      label: "Safety Category",
      description: "Filter to a specific safety category",
    },
    driverCompanyId: {
      type: "string",
      label: "Driver Company ID",
      description: "Driver company ID to retrieve user details",
      async options({ page }) {
        const { users } = await this.listUsers({
          params: {
            page_no: page + 1,
            role: "driver",
          },
        });

        return users.map(({ user }) => ({
          label: user.email || `${user.first_name} ${user.last_name}`,
          value: user.driver_company_id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gomotive.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listHosViolations(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/hos_violations",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/company_webhooks",
        ...opts,
      });
    },
    updateWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/company_webhooks/${webhookId}`,
        ...opts,
      });
    },
    listDriverPerformanceEvents(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/driver_performance_events",
        ...opts,
      });
    },
    retrieveUserDetails(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/users/lookup",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, fieldName, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        const items = data[fieldName];
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
