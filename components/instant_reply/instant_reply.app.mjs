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
      description: "The contact to message. Fetched from your Instant Reply inbox.",
      async options({ page }) {
        const contacts = await this.listContacts({
          params: {
            page: page + 1,
            limit: 50,
          },
        });
        return (contacts?.data ?? []).map((c) => ({
          label: c.display_name || c.phone || c.instagram_username || c.id,
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
          label: `${t.name} (${t.language})`,
          value: t.id,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation",
      description: "An existing conversation in your Instant Reply inbox.",
      async options({ page }) {
        const convs = await this.listConversations({
          params: {
            page: page + 1,
            limit: 50,
          },
        });
        return (convs?.data ?? []).map((c) => ({
          label: c.subject || c.contact_name || c.id,
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
    _makeRequest({
      $ = this, method = "GET", path, params, data,
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
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
    sendMessage({
      $, contactId, channel, body, templateId, templateVariables,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/messages",
        data: {
          contact_id: contactId,
          channel,
          body,
          template_id: templateId,
          template_variables: templateVariables,
        },
      });
    },
    createContact({ $, data }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/contacts",
        data,
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
    addNote({ $, conversationId, text }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/conversations/${conversationId}/notes`,
        data: { text },
      });
    },
    getWebhookEvents(args = {}) {
      return this._makeRequest({
        path: "/webhook-events",
        ...args,
      });
    },
  },
};
