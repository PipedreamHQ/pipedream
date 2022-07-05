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
    fromAddress: {
      type: "string",
      label: "From Address",
      description: "Sender's email address for the From field",
      async options({ accountId }) {
        const accounts = await this.listAccounts();
        const account = accounts.filter((a) => a.accountId === accountId);
        return account[0].sendMailDetails.map((details) => details.fromAddress);
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
    async getOrganization({ $ } = {}) {
      return (await this.makeRequest({
        path: "organization",
        $,
      })).data;
    },
    async createTask({
      $, data,
    } = {}) {
      return (await this.makeRequest({
        path: "tasks/me",
        method: "POST",
        data,
        $,
      })).data;
    },
    async sendEmail({
      $, accountId, data,
    } = {}) {
      return (await this.makeRequest({
        path: `accounts/${accountId}/messages`,
        method: "POST",
        data,
        $,
      })).data;
    },
  },
};
