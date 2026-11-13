import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tawk_to",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "Type to filter property to",
      options: [
        "business",
        "profile",
      ],
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "Identifier of the property to watch",
      async options({ type }) {
        const { data } = await this.listProperties({
          data: {
            type,
          },
        });
        return (
          data?.map(({
            propertyId: value, name: label,
          }) => ({
            value,
            label,
          })) || []
        );
      },
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description:
        "Filter records starting from this timestamp in ISO 8601 format (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description:
        "Filter records ending before this timestamp in ISO 8601 format (e.g. `2026-01-31T23:59:59Z`).",
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description:
        "Number of items to return. For example, use `10` to return up to 10 items.",
      optional: true,
      min: 1,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order of the returned records.",
      optional: true,
      options: [
        {
          label: "Newest first (co-new-old)",
          value: "co-new-old",
        },
        {
          label: "Oldest first (co-old-new)",
          value: "co-old-new",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tawk.to/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, path, data = {}, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        data,
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: "f",
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    listProperties(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/property.list",
        ...opts,
      });
    },
    listChats(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat.list",
        ...opts,
      });
    },
    listTickets(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ticket.list",
        ...opts,
      });
    },
    getMe(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agent.me",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks.create",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks.delete",
        ...opts,
      });
    },
  },
};
