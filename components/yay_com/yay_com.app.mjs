import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "yay_com",
  propDefinitions: {
    sipUser: {
      type: "string",
      label: "SIP User ID",
      description: "The SIP user to make the outbound call for",
      async options() {
        const users = await this.listSipUsers();
        return users?.map(({
          uuid: value, display_name, user_name,
        }) => ({
          label: display_name || user_name,
          value,
        })) || [];
      },
    },
    huntGroups: {
      type: "string[]",
      label: "Target Hunt Groups",
      description: "One or more hunt groups who will receive the outbound call request",
      optional: true,
      async options() {
        const groups = await this.listHuntGroups();
        return groups?.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    phoneBookId: {
      type: "string",
      label: "Phone Book",
      description: "The phone book to monitor for new contacts",
      async options() {
        const books = await this.listPhoneBooks();
        return books?.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "The destination phone number to call (in E164 format for outbound calls). You may also provide extension numbers of your hunt groups, users and call routes.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "What display name should be sent to the user, this will show as the name on their phone (where supported)",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.api_hostname}`;
    },
    _getHeaders() {
      return {
        "x-auth-reseller": `${this.$auth.reseller}`,
        "x-auth-user": `${this.$auth.user}`,
        "x-auth-password": `${this.$auth.password}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      const response = await axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: {
          ...headers,
          ...this._getHeaders(),
        },
        ...args,
      });
      return response.result;
    },
    async listSipUsers(args) {
      return this._makeRequest({
        path: "/voip/user",
        ...args,
      });
    },
    async listHuntGroups(args) {
      return this._makeRequest({
        path: "/voip/group",
        ...args,
      });
    },
    async listPhoneBooks(args) {
      return this._makeRequest({
        path: "/voip/phone-book",
        ...args,
      });
    },
    async listPhoneBookContacts({
      phoneBookId, ...args
    }) {
      return this._makeRequest({
        path: `/voip/phone-book/${phoneBookId}`,
        ...args,
      });
    },
    async listMailboxMessages({
      mailboxId, ...args
    }) {
      return this._makeRequest({
        path: `/voip/mailbox/${mailboxId}/messages`,
        ...args,
      });
    },
    async listDocuments(args) {
      return this._makeRequest({
        path: "/account/document",
        ...args,
      });
    },
    async createOutboundCall(args) {
      return this._makeRequest({
        method: "POST",
        path: "/calls/outbound",
        ...args,
      });
    },
  },
};
