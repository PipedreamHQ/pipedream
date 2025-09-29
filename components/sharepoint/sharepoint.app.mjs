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
        const response = await this.listAllSites(args);
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
    driveId: {
      type: "string",
      label: "Drive ID",
      description: "Identifier of a drive within a site",
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
        const response = await this.listSiteDrives(args);
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
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file to download. You can either search for the file here or provide a custom *File ID*.",
      useQuery: true,
      async options({
        query, siteId, driveId,
      }) {
        const response = query
          ? await this.searchDriveItems({
            siteId,
            query,
            params: {
              select: "folder,name,id",
            },
          })
          : await this.listDriveItems({
            siteId,
            driveId,
          });
        const values = response.value.filter(({ folder }) => !folder);
        return values
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
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
    listAllSites(args = {}) {
      return this._makeRequest({
        path: "/sites?search=*",
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
    listSiteDrives({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drives`,
        ...args,
      });
    },
    listDriveItems({
      siteId, driveId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drives/${driveId}/items/root/children`,
        ...args,
      });
    },
    searchDriveItems({
      siteId, query, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drive/root/search(q='${query}')`,
        ...args,
      });
    },
    getFile({
      driveId, fileId, ...args
    }) {
      return this._makeRequest({
        path: `/drives/${driveId}/items/${fileId}/content`,
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
