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
    subscriberName: {
      type: "string",
      label: "Name",
      description: "The subscriber's name",
      optional: true,
    },
    subscriberTags: {
      type: "object",
      label: "Tags",
      description: "This field is used to apply a list of tags to a Subscriber. With existing subscriber, you can add or remove the tag with this sample expression `{{ {\"add\": [\"tag1\"], \"remove\": [\"tag2\"]} }}`. With the new subscriber, you can add the tag with the array `{{ [\"tag1\", \"tag2\"] }}`",
      optional: true,
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
    listSelfLink: {
      type: "string",
      label: "List Self Link",
      description: "The list self link",
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
          self_link, name,
        }) => ({
          label: name,
          value: self_link,
        }));
        return {
          options,
          context: {
            url: nextUrl || null,
          },
        };
      },
    },
    integrations: {
      type: "string",
      label: "Integrations",
      description: "The integrations",
      async options({
        accountId, prevContext, serviceName,
      }) {
        const { url } = prevContext;
        if (url === null) {
          return [];
        }
        const {
          entries: integrations,
          next_collection_link: nextUrl,
        } = await this.getIntegrations({
          url,
          accountId,
          params: {
            [constants.PAGINATION.SIZE_PROP]: constants.PAGINATION.SIZE,
          },
        });

        const options = integrations
          .filter(({ service_name }) => service_name === serviceName).map(({
            self_link, login,
          }) => ({
            label: login,
            value: self_link,
          }));
        return {
          options,
          context: {
            url: nextUrl || null,
          },
        };
      },
    },
    segmentSelfLink: {
      type: "string",
      label: "Segment Link",
      description: "URL to the [Segment](https://api.aweber.com/#tag/Segments) to send this broadcast to. **e.g. `https://api.aweber.com/1.0/accounts/<account_id>/lists/<list_id>/segments/<segment_id>`**. If not specified, the broadcast will be sent to the “Active Subscribers” segment.",
      async options({
        accountId, listId, prevContext,
      }) {
        const { url } = prevContext;
        if (url === null) {
          return [];
        }
        const {
          entries: segments,
          next_collection_link: nextUrl,
        } = await this.getSegments({
          url,
          accountId,
          listId,
          params: {
            [constants.PAGINATION.SIZE_PROP]: constants.PAGINATION.SIZE,
          },
        });
        const options = segments.map(({
          self_link, name,
        }) => ({
          label: name,
          value: self_link,
        }));
        return {
          options,
          context: {
            url: nextUrl || null,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email address",
      async options({
        accountId, listId, prevContext,
      }) {
        const { url } = prevContext;
        if (url === null) {
          return [];
        }
        const {
          entries: subscribers,
          next_collection_link: nextUrl,
        } = await this.getSubscribersForList({
          url,
          accountId,
          listId,
          params: {
            [constants.PAGINATION.SIZE_PROP]: constants.PAGINATION.SIZE,
          },
        });
        const options = subscribers.map(({ email }) => email );
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
        headers,
        ...otherArgs
      } = args;

      const config = {
        headers: this.getHeaders(headers),
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
    getBroadcasts({
      accountId, listId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/lists/${listId}/broadcasts`,
        ...args,
      });
    },
    getSegments({
      accountId, listId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/lists/${listId}/segments`,
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
    getIntegrations({
      accountId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/integrations`,
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
    createBroadcast({
      accountId, listId, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/accounts/${accountId}/lists/${listId}/broadcasts`,
        ...args,
      });
    },
    async updateSubscriber({
      accountId, listId, email, ...args
    }) {
      return this.makeRequest({
        method: "patch",
        path: `/accounts/${accountId}/lists/${listId}/subscribers?subscriber_email=${email}`,
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
