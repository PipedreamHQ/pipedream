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
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `https://mail.zoho.com/api/${path}`,
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
        },
        ...otherArgs,
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
      $, accountId, params,
    } = {}) {
      return (await this.makeRequest({
        path: `accounts/${accountId}/messages/view`,
        params,
        $,
      })).data;
    },
    async createTask({
      $, data,
    }) {
      return (await this.makeRequest({
        path: "tasks/me",
        method: "POST",
        data,
        $,
      })).data;
    },
  },
};
