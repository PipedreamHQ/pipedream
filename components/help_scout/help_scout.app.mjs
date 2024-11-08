import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "help_scout",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "ID of the agent to whom the conversation is assigned.",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "The unique identifier of the conversation.",
    },
    conversationTitle: {
      type: "string",
      label: "Conversation Title",
      description: "Title of the conversation.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The content of the note or reply.",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "Email of the customer.",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "Optional customer's details such as name and contact.",
      optional: true,
    },
    customerPhone: {
      type: "string",
      label: "Customer Phone",
      description: "Optional phone number of the customer.",
      optional: true,
    },
    chatHandles: {
      type: "string[]",
      label: "Chat Handles",
      description: "Optional chat handles for the customer.",
      optional: true,
    },
    socialProfiles: {
      type: "string[]",
      label: "Social Profiles",
      description: "Optional social profiles for the customer.",
      optional: true,
    },
    customerAddress: {
      type: "object",
      label: "Customer Address",
      description: "Optional address of the customer.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpscout.net/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_token}`,
        },
      });
    },
    async createWebhook({
      url, events, secret,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url,
          events,
          secret,
          payloadVersion: "V2",
        },
      });
    },
    async addNoteToConversation({
      conversationId, text,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/notes`,
        data: {
          text,
        },
      });
    },
    async createCustomer({
      customerEmail,
      customerPhone,
      chatHandles,
      socialProfiles,
      customerAddress,
      ...customerDetails
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data: {
          emails: [
            {
              value: customerEmail,
            },
          ],
          phones: customerPhone
            ? [
              {
                value: customerPhone,
              },
            ]
            : undefined,
          chats: chatHandles
            ? chatHandles.map((handle) => ({
              value: handle,
            }))
            : undefined,
          socialProfiles: socialProfiles
            ? socialProfiles.map((profile) => ({
              value: profile,
            }))
            : undefined,
          address: customerAddress,
          ...customerDetails,
        },
      });
    },
    async sendReplyToConversation({
      conversationId, text,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversations/${conversationId}/reply`,
        data: {
          text,
        },
      });
    },
    async emitNewEventOnConversationAssigned({ agentId }) {
      const events = [
        "convo.assigned",
      ];
      const url = "https://example.com/helpscout"; // Replace with your URL
      const secret = "your_secret_key"; // Generate and replace with your secret key
      await this.createWebhook({
        url,
        events,
        secret,
      });
    },
    async emitNewEventOnCustomerAdded() {
      const events = [
        "customer.created",
      ];
      const url = "https://example.com/helpscout"; // Replace with your URL
      const secret = "your_secret_key"; // Generate and replace with your secret key
      await this.createWebhook({
        url,
        events,
        secret,
      });
    },
    async emitNewEventOnConversationCreated({ conversationTitle }) {
      const events = [
        "convo.created",
      ];
      const url = "https://example.com/helpscout"; // Replace with your URL
      const secret = "your_secret_key"; // Generate and replace with your secret key
      await this.createWebhook({
        url,
        events,
        secret,
      });
    },
  },
};
