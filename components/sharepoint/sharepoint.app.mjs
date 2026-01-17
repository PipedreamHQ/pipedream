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
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The folder to list files in. You can either search for the folder here or provide a custom *Folder ID*.",
      optional: true,
      useQuery: true,
      async options({
        query, siteId, driveId,
      }) {
        // Handle both raw values and __lv wrapped values
        const resolvedSiteId = siteId?.__lv?.value || siteId;
        const resolvedDriveId = driveId?.__lv?.value || driveId;

        if (!resolvedSiteId || !resolvedDriveId) {
          return [];
        }

        const response = query
          ? await this.searchDriveItems({
            siteId: resolvedSiteId,
            query,
            params: {
              select: "folder,name,id",
            },
          })
          : await this.listDriveItems({
            siteId: resolvedSiteId,
            driveId: resolvedDriveId,
          });
        const values = response.value.filter(({ folder }) => folder);
        return values
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    fileId: {
      type: "string",
      label: "File ID",
      description: "The file to download. You can either search for the file here or provide a custom *File ID*.",
      useQuery: true,
      async options({
        query, siteId, driveId, excludeFolders = true,
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
        const values = excludeFolders
          ? response.value.filter(({ folder }) => !folder)
          : response.value;
        return values
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    excelFileId: {
      type: "string",
      label: "Spreadsheet",
      description: "**Search for the file by name.** Only xlsx files are supported.",
      useQuery: true,
      async options({
        siteId, query,
      }) {
        const response = await this.searchDriveItems({
          siteId,
          query,
          params: {
            select: "name,id",
          },
        });
        return response.value.filter(({ name }) => name.endsWith(".xlsx"))
          .map(({
            name, id,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "This is set in the **Table Design** tab of the ribbon",
      async options({
        siteId, itemId,
      }) {
        const response = await this.listExcelTables({
          siteId,
          itemId,
          params: {
            select: "name",
          },
        });
        return response.value.map(({ name }) => name);
      },
    },
    excludeFolders: {
      type: "boolean",
      label: "Exclude Folders?",
      description: "Set to `true` to return only files in the response. Defaults to `false`",
      optional: true,
    },
    fileOrFolderId: {
      type: "string",
      label: "File or Folder",
      description: "Select a file or folder to browse",
      async options({
        siteId, driveId, folderId,
      }) {
        // Handle both raw values and __lv wrapped values
        const resolvedSiteId = siteId?.__lv?.value || siteId;
        const resolvedDriveId = driveId?.__lv?.value || driveId;
        const resolvedFolderId = folderId?.__lv?.value || folderId;

        if (!resolvedSiteId || !resolvedDriveId) {
          return [];
        }
        const response = resolvedFolderId
          ? await this.listDriveItemsInFolder({
            driveId: resolvedDriveId,
            folderId: resolvedFolderId,
          })
          : await this.listDriveItems({
            siteId: resolvedSiteId,
            driveId: resolvedDriveId,
          });
        return response.value?.map(({
          id, name, folder, size,
        }) => ({
          value: JSON.stringify({
            id,
            name,
            isFolder: !!folder,
            size,
          }),
          label: folder
            ? `📁 ${name}`
            : `📄 ${name}`,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers(headers) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
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
    listDriveItemsInFolder({
      driveId, folderId, ...args
    }) {
      return this._makeRequest({
        path: `/drives/${driveId}/items/${folderId}/children`,
        ...args,
      });
    },
    createDriveItem({
      siteId, driveId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drives/${driveId}/items/root/children`,
        method: "POST",
        ...args,
      });
    },
    createDriveItemInFolder({
      siteId, folderId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drive/items/${folderId}/children`,
        method: "POST",
        ...args,
      });
    },
    createLink({
      siteId, fileId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drive/items/${fileId}/createLink`,
        method: "POST",
        ...args,
      });
    },
    listExcelTables({
      siteId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drive/items/${itemId}/workbook/tables`,
        ...args,
      });
    },
    getExcelTable({
      siteId, itemId, tableName, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drive/items/${itemId}/workbook/tables/${tableName}/range`,
        ...args,
      });
    },
    uploadFile({
      siteId, driveId, uploadFolderId, name, ...args
    }) {
      return this._makeRequest({
        path: uploadFolderId
          ? `/sites/${siteId}/drives/${driveId}/items/${uploadFolderId}:/${encodeURI(name)}:/content`
          : `/sites/${siteId}/drives/${driveId}/root:/${encodeURI(name)}:/content`,
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        ...args,
      });
    },
    getDriveItem({
      siteId, driveId, fileId, ...args
    }) {
      // Use driveId if provided, otherwise fall back to site's default drive
      const path = driveId
        ? `/drives/${driveId}/items/${fileId}`
        : `/sites/${siteId}/drive/items/${fileId}`;
      return this._makeRequest({
        path,
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
