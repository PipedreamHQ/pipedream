import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "z_api",
  propDefinitions: {
    phone: {
      type: "string",
      label: "Phone",
      description: "Telephone number of the contact the message will be sent to, i.e.: `551199999999`",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent",
    },
    action: {
      type: "string",
      label: "Action",
      description: "The action to be performed on the chat",
      options: constants.ACTION_OPTIONS,
    },
    pageNum: {
      type: "string",
      label: "Page",
      description: "Used to paginate the results",
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "The number of chats to be retrieved",
    },
    chat: {
      type: "string",
      label: "Chat",
      description: "The chat to be modified",
      async options({ pageNum }) {
        const response = await this.getChats({
          pageNum,
        });
        return response.map(({
          name, phone,
        }) => ({
          label: name || phone,
          value: phone,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.z-api.io/instances/${this.$auth.instance_id}/token/${this.$auth.token_id}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Client-Token": `${this.$auth.account_security_token}`,
          ...headers,
        },
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async sendText(args = {}) {
      return this._makeRequest({
        path: "/send-text",
        method: "post",
        ...args,
      });
    },
    async modifyChat(args = {}) {
      return this._makeRequest({
        path: "/modify-chat",
        method: "post",
        ...args,
      });
    },
    async getChats({
      pageNum,
      ...args
    }) {
      return this._makeRequest({
        path: "/chats",
        params: {
          page: pageNum,
          pageSize: 50,
        },
        ...args,
      });
    },
  },
};
