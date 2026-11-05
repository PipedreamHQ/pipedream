import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postpulse",
  propDefinitions: {
    accountId: {
      type: "integer",
      label: "Account",
      description: "The connected social media account. Use **List Accounts** to see all accounts and their IDs, e.g. `12345`",
      async options() {
        const accounts = await this.listAccounts();
        return accounts.map((account) => ({
          label: `${account.platform} - ${account.accountDisplayName || account.accountUsername || account.id}`,
          value: account.id,
        }));
      },
    },
    chatId: {
      type: "string",
      label: "Destination",
      description: "Required for Facebook, Telegram and Pinterest accounts: the Facebook Page, the Telegram channel or chat, or the Pinterest board to publish to. Use **List Chats** to find destination IDs (the `id` field), e.g. `-1001234567890` for a Telegram channel",
      optional: true,
      async options({ accountId }) {
        if (!accountId) {
          return [];
        }
        const chats = await this.listChats({
          accountId,
        });
        return chats.map((chat) => ({
          label: chat.title,
          value: chat.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.post-pulse.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listChats({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/chats`,
        ...opts,
      });
    },
    importMedia(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/media/upload/import",
        ...opts,
      });
    },
    getMediaImport({
      importId, ...opts
    }) {
      return this._makeRequest({
        path: `/media/upload/import/${importId}`,
        ...opts,
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        ...opts,
      });
    },
  },
};
