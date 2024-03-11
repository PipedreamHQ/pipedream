import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tawk_to",
  propDefinitions: {
    ticketSubject: {
      type: "string",
      label: "Ticket Subject",
      description: "The subject of the ticket",
    },
    initialComment: {
      type: "string",
      label: "Initial Comment",
      description: "The initial comment of the ticket",
    },
    submitter: {
      type: "string",
      label: "Submitter",
      description: "The submitter of the ticket",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the first message in a chat",
    },
    senderDetails: {
      type: "string",
      label: "Sender Details",
      description: "The details of the sender of the first message in a chat",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of the first message in a chat",
    },
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of the chat that ended",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the chat",
    },
    lastMessage: {
      type: "string",
      label: "Last Message",
      description: "The last message in the chat that ended",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tawk.to";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
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
    async createTicket(ticketSubject, initialComment, submitter) {
      return this._makeRequest({
        method: "POST",
        path: "/tickets",
        data: {
          subject: ticketSubject,
          comment: initialComment,
          submitter: submitter,
        },
      });
    },
    async sendMessage(messageContent, senderDetails, timestamp) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        data: {
          content: messageContent,
          sender: senderDetails,
          timestamp: timestamp,
        },
      });
    },
    async endChat(chatId, endTime, lastMessage) {
      return this._makeRequest({
        method: "POST",
        path: `/chats/${chatId}/end`,
        data: {
          end_time: endTime,
          last_message: lastMessage,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
