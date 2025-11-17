import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "trengo",
  propDefinitions: {
    //This is not in the docs, found it by trying
    channelId: {
      type: "integer",
      label: "Channel ID",
      description: "Channel ID",
      async options({ page }) {
        const resp = await this.getChannels({
          params: {
            page: page + 1,
          },
        });
        return resp.data.map((channel) => ({
          label: channel.title,
          value: channel.id,
        }));
      },
    },
    toUserId: {
      type: "integer",
      label: "To User ID",
      description: "Required if `Thread ID` is not set",
      optional: true,
      async options({ page }) {
        const resp = await this.getUsers({
          params: {
            page: page + 1,
          },
        });
        return resp.data.map((user) => ({
          label: user.full_name,
          value: user.id,
        }));
      },
    },
    callDirection: {
      type: "string",
      label: "Direction",
      description: "The direction of the phone call.",
      options: [
        "INBOUND",
        "OUTBOUND",
      ],
    },
    contactIdentifier: {
      type: "string",
      label: "Identifier",
      description: "The contact identifier (email or phone, depending on the channel)",
    },
    contactName: {
      type: "string",
      label: "Name",
      description: "The full name of the contact",
    },
    recepientPhoneNumber: {
      type: "string",
      label: "Recepient Phone Number",
      description: "Should be a valid phone number.",
    },
    hsmId: {
      type: "integer",
      label: "The WhatsApp template ID",
      description: "The WhatsApp template ID.",
    },
    ticketId: {
      type: "integer",
      label: "Ticket ID",
      description: "Select a ticket or provide an ID",
      async options({ page = 0 }) {
        const response = await this.getTickets({
          params: {
            page: page + 1,
          },
        });
        return response.data.map((ticket) => ({
          label: `#${ticket.ticket_id} - ${ticket.subject || "No subject"}`,
          value: ticket.ticket_id,
        }));
      },
    },
    whatsappTemplateParamsKeys: {
      type: "string[]",
      label: "Message param Keys",
      description: "Message param keys",
      optional: true,
    },
    whatsappTemplateParamsValues: {
      type: "string[]",
      label: "Message param Values",
      description: "Message param values",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "An optional note used to create an intern ticket message.",
      optional: true,
    },
    duration: {
      type: "integer",
      label: "Duration",
      description: "The duration in seconds of the phone call.",
      optional: true,
    },
    recordingUrl: {
      type: "string",
      label: "Note",
      description: "A public recording URL.",
      optional: true,
    },
    //Threads cannot be fetched to have them as options
    //API returns Unauthorized when fetching `/threads`
    //Also there is no way to fetch threads in the docs.
    threadId: {
      type: "integer",
      label: "Thread ID",
      description: "Required if `To User ID` is not set",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "HTML message body. Required if `Attachment IDs` is not set. URLs will be automatically converted to A-tags.",
      optional: true,
    },
    attachmentIds: {
      type: "integer[]",
      label: "Attachement IDs",
      description: "IDs of uploaded files. Required if `Body` not set.",
      optional: true,
    },
    parentId: {
      type: "integer",
      label: "Parent ID",
      description: "Set the parent message ID to reply to it.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message send to the receiver.",
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "The subject of the message. Only used when the message is an email.",
      optional: true,
    },
    term: {
      type: "string",
      label: "Search Term",
      description: "Search term to find a contact. If not given, all contacts will be returned.",
      optional: true,
    },
    helpCenterId: {
      type: "integer",
      label: "Help Center ID",
      description: "Select a help center or provide an ID",
      async options({ page = 0 }) {
        const response = await this.getHelpCenters({
          params: {
            page: page + 1,
          },
        });
        return response.data.map((helpCenter) => ({
          label: helpCenter.name || helpCenter.slug,
          value: helpCenter.id,
        }));
      },
    },
    labelId: {
      type: "integer",
      label: "Label ID",
      description: "Select a label or provide an ID",
      async options({ page = 0 }) {
        const response = await this.listLabels({
          params: {
            page: page + 1,
          },
        });
        return response.data.map((label) => ({
          label: label.name,
          value: label.id,
        }));
      },
    },
    messageId: {
      type: "integer",
      label: "Message ID",
      description: "Select a message or provide an ID",
      async options({
        ticketId, page = 0,
      }) {
        const response = await this.getMessages({
          ticketId,
          params: {
            page: page + 1,
          },
        });
        return response.data.map((message) => ({
          label: message.message,
          value: message.id,
        }));
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://app.trengo.com/api/v2${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($, config);
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    async getChannels(args = {}) {
      return this._makeRequest({
        path: "/channels",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async createContact({
      channelId, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/channels/${channelId}/contacts`,
        ...args,
      });
    },
    async sendWhatsappMessageTemplate(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/wa_sessions",
        ...args,
      });
    },
    async logVoiceCall(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/voice/logs",
        ...args,
      });
    },
    async sendTeamChatMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/internal_chat/messages",
        ...args,
      });
    },
    async sendMessage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...args,
      });
    },
    async sendTicketMessage({
      ticketId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tickets/${ticketId}/messages`,
        ...args,
      });
    },
    async getHelpCenters(args = {}) {
      return this._makeRequest({
        path: "/help_center",
        ...args,
      });
    },
    async getArticles({
      helpCenterId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/help_center/${helpCenterId}/articles`,
        ...args,
      });
    },
    async getTickets(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    async getMessages({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}/messages`,
        ...args,
      });
    },
    getMessage({
      ticketId, messageId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}/messages/${messageId}`,
        ...args,
      });
    },
    getLabel({
      labelId, ...args
    }) {
      return this._makeRequest({
        path: `/labels/${labelId}`,
        ...args,
      });
    },
    listLabels(args = {}) {
      return this._makeRequest({
        path: "/labels",
        ...args,
      });
    },
    attachLabel({
      ticketId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tickets/${ticketId}/labels`,
        ...args,
      });
    },
  },
};
