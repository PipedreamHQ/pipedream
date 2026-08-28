import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crpro",
  propDefinitions: {
    connectedPhone: {
      type: "string",
      label: "Connected Number",
      description:
        "The WhatsApp number connected to CRPRO that this operation runs through, in international format (e.g. `5511999999999`).",
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "The CRPRO contact to act on.",
      optional: true,
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            limit: 100,
            offset: page * 100,
          },
        });
        return (data ?? []).map(({ id, name, phone }) => ({
          label: name ? `${name} (${phone})` : phone,
          value: id,
        }));
      },
    },
    pipelineId: {
      type: "string",
      label: "Pipeline",
      description: "Defaults to the organization's default pipeline when left empty.",
      optional: true,
      async options() {
        const { data } = await this.listPipelines();
        return (data ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Stage",
      description:
        "Defaults to the first stage of the pipeline when left empty. Pick a **Pipeline** first to load its stages.",
      optional: true,
      async options({ pipelineId }) {
        const { data } = await this.listPipelines();
        const pipelines = data ?? [];
        const chosen = pipelineId
          ? pipelines.find(({ id }) => id === pipelineId)
          : pipelines.find(({ is_default: isDefault }) => isDefault) ?? pipelines[0];
        return (chosen?.stages ?? []).map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description:
        "Tags already in use in the organization are suggested; a new value creates a new tag.",
      async options() {
        const { data } = await this.listTags();
        return (data ?? []).map(({ name }) => name);
      },
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "Which CRPRO events should emit an event here.",
      async options() {
        const { data } = await this.listWebhookEvents();
        return (data ?? []).map(({ type, label }) => ({
          label,
          value: type,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.crpro.com.br/api/v1";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/send",
        ...opts,
      });
    },
    sendOfficialMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/official/send",
        ...opts,
      });
    },
    createDeal(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/deals",
        ...opts,
      });
    },
    updateDeal({
      dealId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/deals/${dealId}`,
        ...opts,
      });
    },
    listPipelines(opts = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...opts,
      });
    },
    addNote({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/notes`,
        ...opts,
      });
    },
    addTags({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/tags`,
        ...opts,
      });
    },
    listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    sendTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/official/send-template",
        ...opts,
      });
    },
    listWebhookEvents(opts = {}) {
      return this._makeRequest({
        path: "/webhook-events",
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
