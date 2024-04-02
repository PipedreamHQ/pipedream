import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pretix",
  propDefinitions: {
    organizerSlug: {
      type: "string",
      label: "Organizer Slug",
      description: "The slug of the organizer.",
      async options({ page }) {
        const { results } = await this.listOrganizers({
          params: {
            page: page + 1,
          },
        });

        return results.map(({
          slug: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    eventSlug: {
      type: "string",
      label: "Event Slug",
      description: "The slug of the event.",
      async options({
        page, organizerSlug,
      }) {
        const { results } = await this.listEvents({
          organizerSlug,
          params: {
            page: page + 1,
          },
        });

        return results.map(({
          slug: value, name,
        }) => ({
          label: Object.values(name)[0],
          value,
        }));
      },
    },
    orderCode: {
      type: "string",
      label: "Order Code",
      description: "The code of the order.",
      async options({
        page, organizerSlug, eventSlug,
      }) {
        const { results } = await this.listOrders({
          organizerSlug,
          eventSlug,
          params: {
            page: page + 1,
          },
        });

        return results.map(({
          code: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://pretix.eu/api/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listOrganizers(opts = {}) {
      return this._makeRequest({
        path: "organizers",
        ...opts,
      });
    },
    listEvents({
      organizerSlug, ...opts
    }) {
      return this._makeRequest({
        path: `organizers/${organizerSlug}/events`,
        ...opts,
      });
    },
    listOrders({
      organizerSlug, eventSlug, ...opts
    }) {
      return this._makeRequest({
        path: `organizers/${organizerSlug}/events/${eventSlug}/orders`,
        ...opts,
      });
    },
    getOrderDetails({
      organizerSlug, eventSlug, orderCode, ...opts
    }) {
      return this._makeRequest({
        path: `organizers/${organizerSlug}/events/${eventSlug}/orders/${orderCode}`,
        ...opts,
      });
    },
    updateEvent({
      organizerSlug, eventSlug, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `organizers/${organizerSlug}/events/${eventSlug}/`,
        ...opts,
      });
    },
  },
};
