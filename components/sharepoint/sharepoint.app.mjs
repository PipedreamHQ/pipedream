import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sharepoint",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site",
      description: "Identifier of a site",
      async options({ prevContext }) {
        const args = prevContext?.nextLink
          ? {
            url: prevContext.nextLink,
          }
          : {};
        const response = await this.listSites(args);
        const options = response.value?.map(({
          id: value, displayName: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    listId: {
      type: "string",
      label: "List",
      description: "Identifier of a list",
      async options({
        prevContext, siteId,
      }) {
        if (!siteId) {
          return [];
        }
        const args = {
          siteId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listLists(args);
        const options = response.value?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    columnNames: {
      type: "string[]",
      label: "Columns",
      description: "Array of column names",
      async options({
        prevContext, siteId, listId,
      }) {
        if (!siteId || !listId) {
          return [];
        }
        const args = {
          siteId,
          listId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listColumns(args);
        const options = response.value?.map(({ name }) => name ) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    itemId: {
      type: "string",
      label: "Item",
      description: "Identifier of an item",
      async options({
        prevContext, siteId, listId,
      }) {
        if (!siteId) {
          return [];
        }
        const args = {
          siteId,
          listId,
        };
        if (prevContext?.nextLink) {
          args.url = prevContext.nextLink;
        }
        const response = await this.listItems(args);
        const options = response.value?.map(({ id: value }) => ({
          value,
          label: `Item ${value}`,
        })) || [];
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
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
    listSites(args = {}) {
      return this._makeRequest({
        path: "/me/followedSites",
        ...args,
      });
    },
    listLists({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists`,
        ...args,
      });
    },
    listColumns({
      siteId, listId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists/${listId}/columns`,
        ...args,
      });
    },
    listItems({
      siteId, listId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists/${listId}/items`,
        ...args,
      });
    },
    createList({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists`,
        method: "POST",
        ...args,
      });
    },
    createItem({
      siteId, listId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists/${listId}/items`,
        method: "POST",
        ...args,
      });
    },
    updateItem({
      siteId, listId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists/${listId}/items/${itemId}/fields`,
        method: "PATCH",
        ...args,
      });
    },
    async *paginate({
      fn, args,
    }) {
      let nextLink;
      do {
        if (nextLink) {
          args = {
            ...args,
            url: nextLink,
          };
        }
        const response = await fn(args);

        for (const value of response.value) {
          yield value;
        }

        nextLink = response["@odata.nextLink"];
      } while (nextLink);
    },
  },
};
