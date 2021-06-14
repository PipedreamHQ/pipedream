const axios = require("axios");
/* timezone-list: https://www.npmjs.com/package/timezones-list */
const timezones = require("timezones-list");

module.exports = {
  type: "app",
  app: "eventbrite",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      async options({ prevContext }) {
        const {
          prevHasMore: hasMore = false,
          prevContinuation: continuation,
        } = prevContext;
        const params = hasMore
          ? {
            continuation,
          }
          : null;
        const {
          organizations,
          pagination,
        } = await this.listMyOrganizations(
          params,
        );
        const options = organizations.map((org) => {
          const {
            name,
            id,
          } = org;
          return {
            label: name,
            value: id,
          };
        });
        const {
          has_more_items: prevHasMore,
          continuation: prevContinuation,
        } = pagination;
        return {
          options,
          context: {
            prevHasMore,
            prevContinuation,
          },
        };
      },
    },
    eventId: {
      type: "integer",
      label: "Event ID",
      description: "Enter the ID of an event",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone",
      default: "UTC",
      async options() {
        timezones.unshift({
          label: "UTC (GMT+00:00)",
          tzCode: "UTC",
        });
        return timezones.map(({
          label, tzCode,
        }) => ({
          label,
          value: tzCode,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://www.eventbriteapi.com/v3/";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(
      method,
      endpoint,
      params = null,
      data = null,
      url = `${this._getBaseUrl()}${endpoint}`,
    ) {
      const config = {
        method,
        url,
        headers: this._getHeaders(),
        params,
        data,
      };
      return (await axios(config)).data;
    },
    async createHook(orgId, data) {
      return await this._makeRequest(
        "POST",
        `organizations/${orgId}/webhooks/`,
        null,
        data,
      );
    },
    async deleteHook(hookId) {
      return await this._makeRequest("DELETE", `webhooks/${hookId}/`);
    },
    async listMyOrganizations(params) {
      return await this._makeRequest("GET", "users/me/organizations", params);
    },
    async listEvents(
      {
        orgId,
        params,
      },
    ) {
      return await this._makeRequest(
        "GET",
        `organizations/${orgId}/events/`,
        params,
      );
    },
    async getResource(url) {
      return await this._makeRequest("GET", null, null, null, url);
    },
    async getEvent(eventId, params = null) {
      return await this._makeRequest("GET", `events/${eventId}/`, params);
    },
    async getOrderAttendees(orderId) {
      return await this._makeRequest("GET", `orders/${orderId}/attendees/`);
    },
    async getEventAttendees(eventId, params = null) {
      return await this._makeRequest(
        "GET",
        `events/${eventId}/attendees/`,
        params,
      );
    },
    async createEvent(orgId, data) {
      return await this._makeRequest(
        "POST",
        `organizations/${orgId}/events/`,
        null,
        data,
      );
    },
  },
};
