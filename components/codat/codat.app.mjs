import { axios } from "@pipedream/platform";
import eventTypes from "./common/event-types.mjs";

export default {
  type: "app",
  app: "codat",
  propDefinitions: {
    eventTypes: {
      type: "string[]",
      label: "Event Type",
      description: "The type of event to emit when it is produced by Codat",
      options: eventTypes,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Unique identifier of the company to indicate company-specific events. The associated webhook consumer will receive events only for the specified ID.",
      async options({ page }) {
        const { results } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.codat.io";
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
          Authorization: `${this.$auth.authorization_header}`,
          Accept: "application/json",
        },
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
  },
};
