import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sign_plus",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use",
      async options({ prevContext }) {
        const { templates } = await this.listTemplates({
          params: {
            after: prevContext?.index,
          },
        });
        const options = templates?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
        return {
          options,
          context: {
            index: templates?.length
              ? templates[templates.length - 1].id
              : undefined,
          },
        };
      },
    },
    envelopeId: {
      type: "string",
      label: "Envelope ID",
      description: "The ID of an envelope",
      async options({ prevContext }) {
        const { envelopes } = await this.listEnvelopes({
          params: {
            after: prevContext?.index,
          },
        });
        const options = envelopes?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
        return {
          options,
          context: {
            index: envelopes?.length
              ? envelopes[envelopes.length - 1].id
              : undefined,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://restapi.sign.plus/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhook/${webhookId}`,
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/templates",
        ...opts,
      });
    },
    listEnvelopes(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/envelopes",
        ...opts,
      });
    },
    createEnvelopeFromTemplate({
      templateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/envelope/from_template/${templateId}`,
        ...opts,
      });
    },
    sendEnvelope({
      envelopeId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/envelope/${envelopeId}/send`,
        ...opts,
      });
    },
  },
};
