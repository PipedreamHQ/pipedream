import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "flutterwave",
  propDefinitions: {
    bank: {
      type: "string",
      label: "Bank",
      description: "Bank Code of the bank",
      async options({ country }) {
        const { data: banks } = await this.getBanks({
          country,
        });
        return banks.map((b) => ({
          value: b.code,
          label: b.name,
        }));
      },
    },
    country: {
      type: "string",
      label: "Country",
      description: "This is the country code of the Banks being queried",
      options: constants.COUNTRIES,
    },
    payoutSubaccount: {
      type: "string",
      label: "Payout Subaccount",
      description: "The id of a payout subaccount wallet",
      optional: true,
      async options() {
        const { data: subaccounts } = await this.getPayoutSubaccounts();
        return subaccounts.map((s) => ({
          value: s.id,
          label: s.account_name,
        }));
      },
    },
    transaction: {
      type: "string",
      label: "Transaction",
      description: "The identifier of a transaction",
      async options({ page }) {
        const { data: transactions } = await this.getTransactions({
          params: {
            page: page + 1,
          },
        });
        return transactions.map((t) => ({
          value: t.id,
          label: `${t.tx_ref} - ${t.amount} ${t.currency}`,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    _secretApiKey() {
      return this.$auth.secret_api_key;
    },
    _makeRequest(opts = {}) {
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
          ...headers,
          Authorization: `Bearer ${this._secretApiKey()}`,
        },
      });
    },
    getBanks({
      country, ...args
    }) {
      return this._makeRequest({
        path: `/banks/${country}`,
        ...args,
      });
    },
    getPayoutSubaccounts(args = {}) {
      return this._makeRequest({
        path: "/payout-subaccounts",
        ...args,
      });
    },
    getCollectionSubaccounts(args = {}) {
      return this._makeRequest({
        path: "/subaccounts",
        ...args,
      });
    },
    getTransactions(args = {}) {
      return this._makeRequest({
        path: "/transactions",
        ...args,
      });
    },
    getSubscriptions(args = {}) {
      return this._makeRequest({
        path: "/subscriptions",
        ...args,
      });
    },
    getTransfers(args = {}) {
      return this._makeRequest({
        path: "/transfers",
        ...args,
      });
    },
    initiateTransfer(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transfers",
        ...args,
      });
    },
    confirmTransaction({
      transaction, ...args
    }) {
      return this._makeRequest({
        path: `/transactions/${transaction}/verify`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, params,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let currentPage = 1;
      let totalPages = 1;
      do {
        const {
          data, meta: { page_info: pageInfo },
        } = await resourceFn({
          params,
        });
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
        }
        currentPage = pageInfo?.current_page;
        totalPages = pageInfo?.total_pages;
        params.page++;
      } while (currentPage !== totalPages);
    },
  },
};
