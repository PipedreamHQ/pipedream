import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bunnydoc",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the bunnydoc template to be used for the signature request.",
      required: true,
    },
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
      description: "The email address of the recipient of the signature request.",
      optional: true,
    },
    hookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL to receive webhook events.",
      required: true,
    },
    webhookEvents: {
      type: "string[]",
      label: "Webhook Events",
      description: "The list of events to subscribe to.",
      options: [
        {
          label: "Signature Request Viewed",
          value: "signatureRequestViewed",
        },
        {
          label: "Signature Request Signed",
          value: "signatureRequestSigned",
        },
        {
          label: "Signature Request Completed",
          value: "signatureRequestCompleted",
        },
      ],
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bunnydoc.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Api-Key ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async createSignatureRequestFromTemplate({
      templateId, title, emailMessage, signingOrder, recipients, fields,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/createSignatureRequestFromTemplate",
        data: {
          templateId,
          title,
          emailMessage,
          signingOrder,
          recipients,
          fields,
        },
      });
    },
    async subscribeWebhook({
      hookUrl, webhookEvents,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribeWebhook",
        data: {
          hookUrl,
          webhookEvents,
        },
      });
    },
    async unsubscribeWebhook({ id }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/unsubscribeWebhook/${id}`,
      });
    },
    async addTeamMember({
      firstName, surname, email, role, status,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/addTeamMember",
        data: {
          firstName,
          surname,
          email,
          role,
          status,
        },
      });
    },
  },
};
