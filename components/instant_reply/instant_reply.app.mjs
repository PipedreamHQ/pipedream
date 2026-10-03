import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "instant_reply",
  propDefinitions: {
    channel: {
      type: "string",
      label: "Channel",
      description: "The messaging channel to use.",
      options: [
        { label: "WhatsApp", value: "whatsapp" },
        { label: "Instagram", value: "instagram" },
        { label: "Messenger", value: "messenger" },
      ],
    },
    contactId: {
      type: "string",
      label: "Contact",
      description: "The contact to update. Fetched from your Instant Reply inbox.",
      async options({ page }) {
        const contacts = await this._cursorPage("listContacts", page);
        return (contacts?.data ?? []).map((c) => ({
          label: c.name || c.phone || c.id,
          value: c.id,
        }));
      },
    },
    templateId: {
      type: "string",
      label: "Message Template",
      description: "A pre-approved WhatsApp message template from your Instant Reply account.",
      optional: true,
      async options() {
        const templates = await this.listTemplates();
        return (templates?.data ?? []).map((t) => ({
          label: `${t.template_name || t.name || t.id} (${t.language || "default"})`,
          value: t.id,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation",
      description: "An existing conversation in your Instant Reply inbox.",
      async options({ page }) {
        const convs = await this._cursorPage("listConversations", page);
        return (convs?.data ?? []).map((c) => ({
          label: c.customer_name || c.id,
          value: c.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.instantreply.co/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _cursorPage(method, page = 0) {
      let cursor;
      let result;
      for (let index = 0; index <= page; index++) {
        result = await this[method]({ params: { limit: 50, cursor } });
        if (!result?.has_more || !result?.next_cursor) {
          return index < page ? { data: [] } : result;
        }
        cursor = result.next_cursor;
      }
      return result;
    },
    _makeRequest({
      $ = this, method = "GET", path, params, data, headers,
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: { ...this._headers(), ...headers },
        params,
        data,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listConversations(args = {}) {
      return this._makeRequest({
        path: "/conversations",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    sendMessage({ $, conversationId, content, idempotencyKey }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/messages",
        headers: { "Idempotency-Key": idempotencyKey },
        data: { conversation_id: conversationId, content },
      });
    },
    updateContact({ $, contactId, data }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: `/contacts/${contactId}`,
        data,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    listPipelineLeads(args = {}) {
      return this._makeRequest({
        path: "/pipeline/leads",
        ...args,
      });
    },
    triggerJourney({ $, data }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/trigger",
        data,
      });
    },
  },
};
