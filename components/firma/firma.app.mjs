import { axios } from "@pipedream/platform";
import {
  BASE_URL,
  WEBHOOK_EVENTS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "firma",
  propDefinitions: {
    signingRequestId: {
      type: "string",
      label: "Signing Request ID",
      description: "The ID of the signing request",
      async options({ page }) {
        const { results } = await this.listSigningRequests({
          params: {
            page: page + 1,
            page_size: 50,
          },
        });
        return results?.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        })) || [];
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use",
      async options({ page }) {
        const { results } = await this.listTemplates({
          params: {
            page: page + 1,
            page_size: 50,
          },
        });
        return results?.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        })) || [];
      },
    },
    webhookEvents: {
      type: "string[]",
      label: "Webhook Events",
      description: "The events to subscribe to",
      options: WEBHOOK_EVENTS,
    },
  },
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _headers() {
      return {
        "Authorization": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listSigningRequests(opts = {}) {
      return this._makeRequest({
        path: "/signing-requests",
        ...opts,
      });
    },
    getSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signing-requests/${signingRequestId}`,
        ...opts,
      });
    },
    createAndSendSigningRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/signing-requests/create-and-send",
        ...opts,
      });
    },
    cancelSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/signing-requests/${signingRequestId}/cancel`,
        ...opts,
      });
    },
    downloadSigningRequest({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/signing-requests/${signingRequestId}/download`,
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    getTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        path: `/templates/${templateId}`,
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
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        ...opts,
      });
    },
  },
};
