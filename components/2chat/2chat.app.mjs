import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "2chat",
  propDefinitions: {
    account: {
      type: "string",
      label: "2Chat Account",
      description: "The 2Chat account associated with this app",
    },
    connectedNumber: {
      type: "string",
      label: "2Chat Connected Number",
      description: "The 2Chat connected number for receiving Whatsapp events",
    },
    specificOrder: {
      type: "string",
      label: "Specific Order",
      description: "Specific order to be tracked",
      optional: true,
    },
    name: {
      type: "string",
      label: "Contact Name",
      description: "Name of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the contact",
      optional: true,
    },
    textMessage: {
      type: "string",
      label: "Text Message",
      description: "The text message content to be sent",
    },
  },
  methods: {
    _baseUrl() {
      return "https://developers.2chat.co";
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
    async emitNewMessageEvent(account) {
      return this._makeRequest({
        path: `/accounts/${account}/messages`,
        method: "POST",
      });
    },
    async emitNewConversationEvent(connectedNumber) {
      return this._makeRequest({
        path: `/whatsapp/${connectedNumber}/conversations`,
        method: "POST",
      });
    },
    async emitNewOrderEvent(connectedNumber, specificOrder) {
      const opts = specificOrder
        ? {
          path: `/whatsapp/${connectedNumber}/orders/${specificOrder}`,
        }
        : {
          path: `/whatsapp/${connectedNumber}/orders`,
        };
      return this._makeRequest({
        ...opts,
        method: "POST",
      });
    },
    async createContact(name, phoneNumber, email, company) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        data: {
          name,
          phoneNumber,
          email,
          company,
        },
      });
    },
    async sendMessage(phoneNumber, textMessage) {
      return this._makeRequest({
        path: `/whatsapp/${phoneNumber}/messages`,
        method: "POST",
        data: {
          text: textMessage,
        },
      });
    },
    async checkWhatsAppAccount(phoneNumber) {
      return this._makeRequest({
        path: `/whatsapp/${phoneNumber}`,
        method: "GET",
      });
    },
  },
};
