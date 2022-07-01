import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_mail",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account ID",
      description: "The unique Zoho Account number associated with the particular account",
      async options() {
        const accounts = await this.listAccounts();
        return accounts.map((account) => ({
          label: account.displayName ?? account.accountId,
          value: account.accountId,
        }));
      },
    },
  },
  methods: {
    async makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
      } = args;
      const config = {
        method,
        url: `http://mail.zoho.com/api/${path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
        ...args,
      };
      return axios($, config);
    },
    async listAccounts({ $ } = {}) {
      return (await this.makeRequest({
        path: "accounts",
        $,
      })).data;
    },
    async listEmails({
      $, accountId,
    } = {}) {
      return (await this.makeRequest({
        path: `accounts/${accountId}/messages/view`,
        $,
      })).data;
    },
  },
};
