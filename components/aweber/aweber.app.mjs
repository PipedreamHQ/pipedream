import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "aweber",
  propDefinitions: {
    wsStart: {
      type: "integer",
      label: "Start",
      description: "The pagination starting offset.",
      default: constants.PAGINATION.START,
      min: 0,
    },
    wsSize: {
      type: "integer",
      label: "Limit",
      description: "The pagination total entries to retrieve.",
      default: constants.PAGINATION.SIZE,
      min: 1,
      max: 100,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum number of resources to retrieve.",
      default: constants.PAGINATION.MAX,
      min: 1,
    },
    accountId: {
      type: "integer",
      label: "Account ID",
      description: "The account ID",
      async options({ prevContext }) {
        const { url } = prevContext;
        if (url === null) {
          return [];
        }
        const {
          entries: accounts,
          next_collection_link: nextUrl,
        } =
          await this.getAccounts({
            url,
            params: {
              [constants.PAGINATION.SIZE_PROP]: constants.PAGINATION.SIZE,
            },
          });
        const options = accounts.map(({
          id, uuid,
        }) => ({
          label: uuid,
          value: id,
        }));
        return {
          options,
          context: {
            url: nextUrl || null,
          },
        };
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The list ID",
      async options({
        accountId, prevContext,
      }) {
        const { url } = prevContext;
        if (url === null) {
          return [];
        }
        const {
          entries: lists,
          next_collection_link: nextUrl,
        } = await this.getLists({
          url,
          accountId,
          params: {
            [constants.PAGINATION.SIZE_PROP]: constants.PAGINATION.SIZE,
          },
        });
        const options = lists.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
        return {
          options,
          context: {
            url: nextUrl || null,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        "Accept": "application/json",
        "User-Agent": "AWeber-Node-code-sample/1.0",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async makeRequest(args = {}) {
      const {
        $ = this,
        url,
        path,
        ...otherArgs
      } = args;

      const config = {
        headers: this.getHeaders(otherArgs.headers),
        url: this.getUrl(path, url),
        ...otherArgs,
      };

      return axios($, config);
    },
    async getAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async getAccount({
      accountId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}`,
        ...args,
      });
    },
    async getLists({
      accountId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/lists`,
        ...args,
      });
    },
    async getSubscribersForList({
      accountId, listId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/lists/${listId}/subscribers`,
        ...args,
      });
    },
    async getSubscribersForAccount({
      accountId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}`,
        ...args,
      });
    },
    async addSubscriber({
      accountId, listId, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/accounts/${accountId}/lists/${listId}/subscribers`,
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.PAGINATION.MAX,
    }) {
      let url;
      let resourcesCount = 0;

      while (true) {
        const nextArgs = !url
          ? resourceFnArgs
          : {
            url,
          };

        const {
          entries: nextResources,
          next_collection_link: nextUrl,
        } = await resourceFn(nextArgs);

        if (nextUrl) {
          url = nextUrl;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (!nextUrl) {
          return;
        }
      }
    },
  },
};
