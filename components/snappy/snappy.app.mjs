import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "snappy",
  propDefinitions: {
    accountId: {
      label: "Account ID",
      description: "The account ID",
      type: "string",
      async options() {
        const accounts = await this.getAccounts();

        return accounts.map((account) => ({
          label: account.organization,
          value: account.id,
        }));
      },
    },
    mailboxId: {
      label: "Mailbox ID",
      description: "The mailbox ID",
      type: "string",
      async options({ accountId }) {
        const mailboxes = await this.getMailboxes({
          accountId,
        });

        return mailboxes.map((mailbox) => ({
          label: mailbox.display,
          value: mailbox.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://app.besnappy.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKey(),
          password: "",
        },
        ...args,
      });
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async getMailboxes({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/mailboxes`,
        ...args,
      });
    },
    async getInboxTickets({
      mailboxId, ...args
    }) {
      return this._makeRequest({
        path: `/mailbox/${mailboxId}/inbox`,
        ...args,
      });
    },
    async getTicketsAssignedToMe({
      mailboxId, ...args
    }) {
      return this._makeRequest({
        path: `/mailbox/${mailboxId}/yours`,
        ...args,
      });
    },
    async getWaitingTickets({
      mailboxId, ...args
    }) {
      return this._makeRequest({
        path: `/mailbox/${mailboxId}/yours`,
        ...args,
      });
    },
    async getWallPosts({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/wall`,
        ...args,
      });
    },
    async createWallPost({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/account/${accountId}/wall`,
        method: "post",
        ...args,
      });
    },
  },
};
