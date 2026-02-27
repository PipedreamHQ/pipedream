import { axios } from "@pipedream/platform";
import timezones from "timezones-list";

export default {
  type: "app",
  app: "eventbrite",
  propDefinitions: {
    organization: {
      type: "string",
      label: "Organization",
      description: "Select an organization",
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
        } = await this.listMyOrganizations(params);
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
    event: {
      type: "string",
      label: "Event",
      description: "Select a specific event (optional - leave blank to trigger for all events)",
      optional: true,
      async options({
        organization,
        prevContext,
      }) {
        if (!organization) {
          return [];
        }
        const {
          prevHasMore: hasMore = false,
          prevContinuation: continuation,
        } = prevContext;
        const params = {
          status: "live,started,ended",
          order_by: "start_desc",
          ...(hasMore && {
            continuation,
          }),
        };
        const {
          events,
          pagination,
        } = await this.listEvents({
          orgId: organization,
          params,
        });
        const options = events.map((event) => ({
          label: event.name.text,
          value: event.id,
        }));
        const {
          has_more_items: prevHasMore,
          continuation: prevContinuation,
        } = pagination || {};
        return {
          options,
          context: {
            prevHasMore,
            prevContinuation,
          },
        };
      },
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
    async _makeRequest({
      $ = this,
      endpoint,
      url = `${this._getBaseUrl()}${endpoint}`,
      ...args
    }) {
      const config = {
        url,
        headers: this._getHeaders(),
        ...args,
      };
      const maxAttempts = 3;
      let minutes = 0, attempt = 0;
      while (attempt < maxAttempts) {
        try {
          return await axios($, config);
        } catch (err) {
          const status = err?.response?.status;
          if (status === 429) {
            const retryAfter = err?.response?.headers?.["retry-after"];
            const waitMs = retryAfter
              ? parseInt(retryAfter) * 1000
              : Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            attempt++;
            minutes = this.getRetryWaitMinutes(err?.response?.headers?.["x-rate-limit"]);
          } else {
            throw err;
          }
        }
      }
      throw new Error(`Eventbrite rate limit exceeded. Please try again ${minutes
        ? `in ${minutes} minutes`
        : "later"}.`);
    },
    // get minutes to wait from x-rate-limit header if available
    getRetryWaitMinutes(rateLimit) {
      if (!rateLimit) return 0;

      const segments = rateLimit.split(",").map((s) => s.trim());
      let maxResetSeconds = 0;

      for (const segment of segments) {
        const match = segment.match(/(\d+)\/(\d+).*reset=(\d+)s/);
        if (!match) continue;

        const used = parseInt(match[1], 10);
        const limit = parseInt(match[2], 10);
        const resetSeconds = parseInt(match[3], 10);

        if (used >= limit) {
          maxResetSeconds = Math.max(maxResetSeconds, resetSeconds);
        }
      }
      return Math.ceil(maxResetSeconds / 60);
    },
    createHook(orgId, data) {
      return this._makeRequest({
        method: "POST",
        endpoint: `organizations/${orgId}/webhooks/`,
        data,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        endpoint: `webhooks/${hookId}/`,
      });
    },
    listMyOrganizations(params) {
      return this._makeRequest({
        endpoint: "users/me/organizations",
        params,
      });
    },
    listEvents({
      orgId,
      params,
    }) {
      return this._makeRequest({
        endpoint: `organizations/${orgId}/events/`,
        params,
      });
    },
    listUserOrders(args = {}) {
      return this._makeRequest({
        endpoint: "users/me/orders",
        ...args,
      });
    },
    getResource(url) {
      return this._makeRequest({
        url,
      });
    },
    getOrderAttendees(orderId) {
      return this._makeRequest({
        endpoint: `orders/${orderId}/attendees/`,
      });
    },
    getEvent($, eventId, params) {
      return this._makeRequest({
        endpoint: `events/${eventId}/`,
        params,
        $,
      });
    },
    getEventAttendees($, eventId, params) {
      return this._makeRequest({
        endpoint: `events/${eventId}/attendees/`,
        params,
        $,
      });
    },
    createEvent($, orgId, data) {
      return this._makeRequest({
        method: "POST",
        endpoint: `organizations/${orgId}/events/`,
        data,
        $,
      });
    },
  },
};
