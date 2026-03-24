import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

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
        return await this.getPropOptions({
          accountId,
          resourceFn: this.listCustomerTypes,
          resourceKey: "CustomerType",
          valueKey: "customerTypeID",
          labelKey: "name",
          next: prevContext?.next,
        });
      },
    },
    itemId: {
      type: "string",
      label: "Item",
      description: "Identifier of an inventory item",
      async options({
        accountId, prevContext,
      }) {
        return await this.getPropOptions({
          accountId,
          resourceFn: this.listItems,
          resourceKey: "Item",
          valueKey: "itemID",
          labelKey: "description",
          next: prevContext?.next,
        });
      },
    },
    shopId: {
      type: "string",
      label: "Shop",
      description: "Identifier of a shop",
      async options({
        accountId, prevContext,
      }) {
        return await this.getPropOptions({
          accountId,
          resourceFn: this.listShops,
          resourceKey: "Shop",
          valueKey: "shopID",
          labelKey: "name",
          next: prevContext?.next,
        });
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
    async _makeRequest({
      $ = this,
      path,
      url,
      ...args
    }) {
      const config = {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      let attempt = 0;
      while (attempt < MAX_RETRIES) {
        try {
          return await axios($, config);
        } catch (err) {
          const status = err?.response?.status;
          if (status === 429) {
            const retryAfter = err?.response?.headers?.["retry-after"];
            const waitMs = retryAfter
              ? parseInt(retryAfter) * 1000
              : Math.pow(2, attempt) * BASE_BACKOFF_MS;
            console.log(`Rate limited (429). Waiting ${waitMs}ms before retry (attempt ${attempt + 1}/${MAX_RETRIES})`);
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            attempt++;
          } else {
            throw err;
          }
        }
      }
      // Final attempt after exhausting retries — let the error propagate
      return axios($, config);
    },
    async getPropOptions({
      accountId, resourceFn, resourceKey, valueKey, labelKey, next,
    }) {
      const args = {
        accountId,
      };
      if (next) {
        args.url = next;
      }
      const response = await resourceFn(args);
      const attributes = response["@attributes"];
      const items = !response[resourceKey]
        ? []
        : Array.isArray(response[resourceKey])
          ? response[resourceKey]
          : [
            response[resourceKey],
          ];
      const options = items?.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
      })) || [];
      return {
        options,
        context: {
          next: attributes?.next,
        },
      };
    },
    getAccount(args = {}) {
      return this._makeRequest({
        path: "/Account.json",
        ...args,
      });
    },
    getItem({
      accountId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Item/${itemId}.json`,
        ...args,
      });
    },
    getInventoryLog({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/InventoryLog.json`,
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
    listItems({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Item.json`,
        ...args,
      });
    },
    listShops({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Shop.json`,
        ...args,
      });
    },
    listSales({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Sale.json`,
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
    createEmployee({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Employee.json`,
        method: "POST",
        ...args,
      });
    },
    updateItem({
      accountId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/Account/${accountId}/Item/${itemId}.json`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceKey,
      limit,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          limit: DEFAULT_LIMIT,
        },
      };
      let count = 0;
      do {
        const response = await resourceFn(args);
        const attributes = response["@attributes"];
        if (!response[resourceKey]) {
          return;
        }
        const items = Array.isArray(response[resourceKey])
          ? response[resourceKey]
          : [
            response[resourceKey],
          ];
        for (const item of items) {
          yield item;
          count++;
          if (limit && count >= limit) {
            return;
          }
        }
        const next = attributes?.next;
        if (!next) {
          return;
        }
        args = {
          url: next,
        };
      } while (true);
    },
  },
};
