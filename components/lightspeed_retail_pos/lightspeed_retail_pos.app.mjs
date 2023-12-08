import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lightspeed_retail_pos",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account",
      description: "Identifier of your account",
      async options() {
        const { Account: account } = await this.getAccount();
        return [
          {
            value: account.accountID,
            label: account.name,
          },
        ];
      },
    },
    customerTypeId: {
      type: "string",
      label: "Customer Type",
      description: "Identifier of a customer type",
      optional: true,
      async options({
        accountId, prevContext,
      }) {
        const args = {
          accountId,
        };
        if (prevContext?.next) {
          args.url = prevContext.next;
        }
        const response = await this.listCustomerTypes(args);
        const attributes = response["@attributes"];
        const types = response.CustomerType;
        const options = types?.map(({
          customerTypeID: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            next: attributes?.next,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lightspeedapp.com/API/V3";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getAccount(args = {}) {
      return this._makeRequest({
        path: "/Account.json",
        ...args,
      });
    },
    listCustomerTypes({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/CustomerType.json`,
        ...args,
      });
    },
    createCustomer({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Customer.json`,
        method: "POST",
        ...args,
      });
    },
  },
};
