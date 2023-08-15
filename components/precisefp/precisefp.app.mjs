import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "precisefp",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account to monitor.",
      async options({ prevContext }) {
        const {
          params: { offset },
          items: accounts,
        } =
          await this.listAccounts({
            params: {
              offset: prevContext?.offset || 0,
            },
          });

        const options = accounts.map(({
          id: value, client: { email: label },
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            offset,
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
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    listPersons({
      accountId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/accounts/${accountId}/persons`,
        ...args,
      });
    },
    listPDFEngagements(args = {}) {
      return this.makeRequest({
        path: "/pdf-engagements",
        ...args,
      });
    },
    listFormEngagements(args = {}) {
      return this.makeRequest({
        path: "/form-engagements",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      hasPagination = true,
      max = constants.DEFAULT_MAX,
    }) {
      let offset = 0;
      let resourcesCount = 0;

      while (true) {
        console.log(`Fetching resources with offset ${offset}`);
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              offset,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (!hasPagination) {
          return;
        }

        offset = response.params?.offset;
      }
    },
  },
};
