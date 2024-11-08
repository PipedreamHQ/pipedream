import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "insertchat",
  propDefinitions: {
    leadContactInfo: {
      type: "object",
      label: "Lead Contact Information",
      description: "The contact information for the lead (name, email, phone, etc.)",
      required: true,
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "The status of the lead (new, in-progress, converted)",
      optional: true,
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The unique identifier for the lead",
      required: true,
    },
    chatSessionId: {
      type: "string",
      label: "Chat Session ID",
      description: "The unique identifier for the chat session",
      required: true,
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to be pushed into the chat session",
      required: true,
    },
    messageSender: {
      type: "string",
      label: "Message Sender",
      description: "The sender of the message (user or ai)",
      optional: true,
    },
    userInfo: {
      type: "object",
      label: "User Info",
      description: "The user's information",
      required: true,
    },
    chatTranscript: {
      type: "string",
      label: "Chat Transcript",
      description: "The transcript of the chat session",
      required: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.insertchat.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async emitNewChatbot() {
      return this._makeRequest({
        path: "/chatbots/new",
      });
    },
    async emitNewLead(contactInfo) {
      return this._makeRequest({
        method: "POST",
        path: "/leads/new",
        data: contactInfo,
      });
    },
    async emitNewChatSession(userInfo, chatTranscript) {
      return this._makeRequest({
        method: "POST",
        path: "/chats/new",
        data: {
          userInfo,
          chatTranscript,
        },
      });
    },
    async createNewLead(contactInfo, leadStatus) {
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        data: {
          contactInfo,
          status: leadStatus,
        },
      });
    },
    async deleteLead(leadId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/leads/${leadId}`,
      });
    },
    async pushMessage(sessionId, messageContent, sender) {
      return this._makeRequest({
        method: "POST",
        path: `/chats/${sessionId}/messages`,
        data: {
          content: messageContent,
          sender,
        },
      });
    },
  },
};
