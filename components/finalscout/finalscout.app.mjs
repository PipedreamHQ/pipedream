import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "finalscout",
  propDefinitions: {
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Use tags to organize your contacts in FinalScout web app",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "A URL to receive the webhook event for this task. A webhook event will be sent to the URL when the task is completed, regardless of whether an email is found or not",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Use this param to send custom meta data (like contact id) associated with the contact. The custom data will be returned in the response and webhook event.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.finalscout.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: this.$auth.api_key,
        },
        ...opts,
      });
    },
    findEmailViaLinkedIn(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find/linkedin/single",
        ...opts,
      });
    },
    findEmailViaNewsArticle(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find/author/single",
        ...opts,
      });
    },
    findEmailProfessional(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/find/professional/single",
        ...opts,
      });
    },
    getSingleTask(opts = {}) {
      return this._makeRequest({
        path: "/find/single/status",
        ...opts,
      });
    },
  },
};
