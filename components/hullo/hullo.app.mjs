import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hullo",
  propDefinitions: {
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The ID of the Hullo member",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message to send",
    },
    memberInfo: {
      type: "object",
      label: "Member Info",
      description: "Details of the member such as name, email, etc.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.hullo.me/api";
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
    async sendMessage(memberId, messageContent) {
      return this._makeRequest({
        method: "POST",
        path: `/members/${memberId}/messages`,
        data: {
          content: messageContent,
        },
      });
    },
    async addOrUpdateMember(memberId, memberInfo) {
      return this._makeRequest({
        method: "PUT",
        path: `/members/${memberId}`,
        data: memberInfo,
      });
    },
  },
};
