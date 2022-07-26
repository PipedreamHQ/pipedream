import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thanks_io",
  propDefinitions: {
    subAccount: {
      type: "string",
      label: "Sub Account",
      description: "ID of subaccount to use",
      optional: true,
      async options() {
        const subAccounts = (await this.listSubAccounts()).data;
        return subAccounts.map((account) => ({
          value: account.id,
          label: account.title,
        }));
      },
    },
    mailingList: {
      type: "string",
      label: "Mailing List",
      description: "Mailing List to watch for new recipients",
      async options({
        subAccount, prevContext, page,
      }) {
        if (page !== 0 && !prevContext?.next) {
          return [];
        }
        const params = subAccount
          ? {
            sub_account: subAccount,
          }
          : undefined;
        const {
          data: mailingLists, links,
        } = prevContext?.next
          ? await this._makeRequest({
            url: prevContext,
            params,
          })
          : await this.listMailingLists({
            params,
          });
        return {
          options: mailingLists.map((list) => ({
            value: list.id,
            label: list.description,
          })),
          context: {
            next: links.next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thanks.io/api/v2/";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest(args) {
      const {
        $ = this,
        method = "GET",
        path,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async listMailingLists(args = {}) {
      return this._makeRequest({
        path: "mailing-lists",
        ...args,
      });
    },
    async listOrders(args = {}) {
      return this._makeRequest({
        path: "orders/list",
        ...args,
      });
    },
    async listRecipients(listId, args = {}) {
      return this._makeRequest({
        path: `mailing-lists/${listId}/recipients`,
        ...args,
      });
    },
    async listSubAccounts(args = {}) {
      return this._makeRequest({
        path: "sub-accounts",
        ...args,
      });
    },
  },
};
