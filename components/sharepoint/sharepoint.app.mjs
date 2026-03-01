import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import { WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS } from "./common/constants.mjs";
import pickBy from "lodash.pickby";

export default {
  type: "app",
  app: "sharepoint",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site",
      description: "Identifier of a site",
      useQuery: true,
      async options({
        prevContext, query,
      }) {
        const args = prevContext?.nextLink
          ? {
            url: prevContext.nextLink,
          }
          : {};
        if (query) {
          args.params = {
            search: query,
          };
        }
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
        mapper = ({ name }) => name,
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
        const options = response.value?.map(mapper) || [];
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
        siteId = this.resolveWrappedValue(siteId);
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
        const resolvedSiteId = this.resolveWrappedValue(siteId);
        const resolvedDriveId = this.resolveWrappedValue(driveId);

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
        const resolvedSiteId = this.resolveWrappedValue(siteId);
        const resolvedDriveId = this.resolveWrappedValue(driveId);

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
    fileIds: {
      type: "string[]",
      label: "Files",
      description: "Select files or enter custom file IDs.",
      async options({
        siteId, driveId, folderId,
      }) {
        const resolvedSiteId = this.resolveWrappedValue(siteId);
        const resolvedDriveId = this.resolveWrappedValue(driveId);
        const resolvedFolderId = this.resolveWrappedValue(folderId);

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

        return response.value
          ?.filter(({ folder }) => !folder)
          .map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })) || [];
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
    select: {
      type: "string",
      label: "Select",
      description: "A comma-separated list of properties to return in the response",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
    fileOrFolderId: {
      type: "string",
      label: "File or Folder",
      description: "Select a file or folder to browse",
      async options({
        siteId, driveId, folderId,
      }) {
        // Handle both raw values and __lv wrapped values
        const resolvedSiteId = this.resolveWrappedValue(siteId);
        const resolvedDriveId = this.resolveWrappedValue(driveId);
        const resolvedFolderId = this.resolveWrappedValue(folderId);

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
          id, name, folder, size, lastModifiedDateTime, webUrl, description,
        }) => ({
          value: JSON.stringify({
            id,
            name,
            isFolder: !!folder,
            size,
            childCount: folder?.childCount,
            lastModifiedDateTime,
            webUrl,
            description,
          }),
          label: folder
            ? `📁 ${name}`
            : `📄 ${name}`,
        })) || [];
      },
    },
  },
  methods: {
    /**
     * Resolves a potentially wrapped labeled value to its actual value.
     * Pipedream props with withLabel: true wrap values in a special format.
     *
     * @param {*} value - The value to resolve (may be wrapped or plain)
     * @returns {*} The unwrapped value, or the original value if not wrapped
     * @example
     * // Wrapped labeled value
     * resolveWrappedValue({ __lv: { label: "My Site", value: "abc123" } }) // "abc123"
     *
     * // Plain value (not wrapped)
     * resolveWrappedValue("abc123") // "abc123"
     */
    resolveWrappedValue(value) {
      return value?.value || value;
    },
    /**
     * Resolves an array of potentially wrapped labeled values.
     * Handles both Pipedream's labeled value array format and plain arrays.
     *
     * @param {Array|Object} arr
     *   Array to resolve (may be wrapped or plain)
     * @returns {Array} Array of unwrapped values
     * @example
     * // Wrapped array of labeled values
     * resolveWrappedArrayValues({
     *   __lv: [
     *     { label: "File 1", value: "id1" },
     *     { label: "File 2", value: "id2" }
     *   ]
     * }) // ["id1", "id2"]
     *
     * // Plain array
     * resolveWrappedArrayValues(["id1", "id2"]) // ["id1", "id2"]
     */
    resolveWrappedArrayValues(arr) {
      if (!arr) return [];
      // Handle __lv wrapped array
      const unwrapped = arr?.__lv || arr;
      if (!Array.isArray(unwrapped)) return [];
      // Extract value from each item if it's a labeled value object
      return unwrapped.map((item) => item?.value ?? item);
    },
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    /**
     * Creates a Microsoft Graph SDK client with caching.
     * This provides better consistency with other Microsoft components
     * and includes built-in pagination and type safety.
     */
    client() {
      return Client.initWithMiddleware({
        authProvider: {
          getAccessToken: () => Promise.resolve(this._getAccessToken()),
        },
      });
    },
    getSite({
      siteId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}`)
        .query(pickBy(params))
        .get();
    },
    listSites({ params = {} } = {}) {
      return this.client().api("/me/followedSites")
        .query(pickBy(params))
        .get();
    },
    listAllSites({ params = {} } = {}) {
      if (!params.search) {
        params.search = "*";
      }
      return this.client().api("/sites")
        .query(pickBy(params))
        .get();
    },
    listLists({
      siteId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists`)
        .query(pickBy(params))
        .get();
    },
    listColumns({
      siteId, listId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists/${listId}/columns`)
        .query(pickBy(params))
        .get();
    },
    listItems({
      siteId, listId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists/${listId}/items`)
        .query(pickBy(params))
        .get();
    },
    getListItem({
      siteId, listId, itemId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists/${listId}/items/${itemId}`)
        .query(pickBy(params))
        .get();
    },
    listSiteDrives({
      siteId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drives`)
        .query(pickBy(params))
        .get();
    },
    listDriveItems({
      siteId, driveId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drives/${driveId}/root/children`)
        .query(pickBy(params))
        .get();
    },
    listDriveItemsInFolder({
      driveId, folderId, params = {},
    } = {}) {
      return this.client().api(`/drives/${driveId}/items/${folderId}/children`)
        .query(pickBy(params))
        .get();
    },
    createDriveItem({
      siteId, driveId, data = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drives/${driveId}/root/children`)
        .post(data);
    },
    createDriveItemInFolder({
      siteId, folderId, data = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drive/items/${folderId}/children`)
        .post(data);
    },
    createLink({
      siteId, fileId, data = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drive/items/${fileId}/createLink`)
        .post(data);
    },
    listExcelTables({
      siteId, itemId, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drive/items/${itemId}/workbook/tables`)
        .query(pickBy(params))
        .get();
    },
    getExcelTable({
      siteId, itemId, tableName, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drive/items/${itemId}/workbook/tables/${tableName}/range`)
        .query(pickBy(params))
        .get();
    },
    uploadFile({
      siteId, driveId, uploadFolderId, name, data,
    } = {}) {
      const path = uploadFolderId
        ? `/sites/${siteId}/drives/${driveId}/items/${uploadFolderId}:/${encodeURI(name)}:/content`
        : `/sites/${siteId}/drives/${driveId}/root:/${encodeURI(name)}:/content`;
      return this.client().api(path)
        .put(data);
    },
    getDriveItem({
      siteId, driveId, fileId, params = {},
    } = {}) {
      const path = driveId
        ? `/drives/${driveId}/items/${fileId}`
        : `/sites/${siteId}/drive/items/${fileId}`;
      return this.client().api(path)
        .query(pickBy(params))
        .get();
    },
    listDriveItemPermissions({
      driveId, itemId, params = {},
    } = {}) {
      return this.client().api(`/drives/${driveId}/items/${itemId}/permissions`)
        .query(pickBy(params))
        .get();
    },
    searchDriveItems({
      siteId, query, params = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/drive/root/search(q='${encodeURIComponent(query)}')`)
        .query(pickBy(params))
        .get();
    },
    getFile({
      driveId, fileId, params = {},
    } = {}) {
      return this.client().api(`/drives/${driveId}/items/${fileId}/content`)
        .query(pickBy(params))
        .get();
    },
    createList({
      siteId, data = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists`)
        .post(data);
    },
    createItem({
      siteId, listId, data = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists/${listId}/items`)
        .post(data);
    },
    updateItem({
      siteId, listId, itemId, data = {},
    } = {}) {
      return this.client().api(`/sites/${siteId}/lists/${listId}/items/${itemId}/fields`)
        .patch(data);
    },
    listGroups({ params = {} } = {}) {
      return this.client().api("/groups")
        .query(pickBy(params))
        .get();
    },
    listUsers({ params = {} } = {}) {
      return this.client().api("/users")
        .query(pickBy(params))
        .get();
    },
    listGroupMembers({
      groupId, params = {},
    } = {}) {
      return this.client().api(`/groups/${groupId}/members`)
        .query(pickBy(params))
        .get();
    },
    /**
     * Get delta changes for a drive using Microsoft Graph delta query.
     * Enables tracking changes to files and folders over time.
     *
     * @param {Object} options - Request options
     * @param {string} options.driveId - Drive ID to track
     * @param {string} [options.deltaLink]
     *   Delta link from previous response (for pagination/continuation)
     * @returns {Promise<Object>} Response with changed items and
     *   @odata.deltaLink or @odata.nextLink
     * @see https://learn.microsoft.com/en-us/graph/api/driveitem-delta
     * @example
     * // First call - get initial state
     * const initial = await this.getDriveDelta({ driveId: "b!..." });
     * const deltaLink = initial["@odata.deltaLink"];
     *
     * // Later - get changes since last call
     * const changes = await this.getDriveDelta({
     *   driveId: "b!...", deltaLink
     * });
     */
    getDriveDelta({
      driveId, deltaLink,
    } = {}) {
      if (deltaLink) {
        const path = deltaLink.replace(/^https:\/\/graph\.microsoft\.com\/v[^/]+/, "");
        return this.client().api(path)
          .get();
      }
      return this.client().api(`/drives/${driveId}/root/delta`)
        .get();
    },
    searchQuery({ data = {} } = {}) {
      return this.client().api("/search/query")
        .post(data);
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
    /**
     * Creates a Microsoft Graph subscription for change notifications
     * (webhooks). Subscriptions expire after a set time and must be
     * renewed periodically.
     *
     * @param {Object} options - Subscription options
     * @param {string} options.resource
     *   Resource to monitor (e.g., "drives/{driveId}/root")
     * @param {string} options.notificationUrl - Webhook endpoint URL
     * @param {string} [options.changeType="updated"]
     *   Type of change to monitor (updated, created, deleted)
     * @param {string} options.clientState
     *   Secret string for webhook validation
     * @returns {Promise<Object>}
     *   Created subscription with id and expirationDateTime
     * @see https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions
     * @example
     * const subscription = await this.createSubscription({
     *   resource: "drives/b!abc123.../root",
     *   notificationUrl: "https://webhook.site/unique-id",
     *   changeType: "updated",
     *   clientState: "secret-validation-token"
     * });
     */
    createSubscription({
      resource, notificationUrl, changeType = "updated", clientState,
    } = {}) {
      const expirationDateTime = new Date(
        Date.now() + WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
      ).toISOString();
      return this.client().api("/subscriptions")
        .post({
          changeType,
          notificationUrl,
          resource,
          expirationDateTime,
          clientState,
        });
    },
    /**
     * Updates a subscription's expiration time (renewal).
     * Subscriptions must be renewed before they expire to maintain continuous monitoring.
     *
     * @param {Object} options - Update options
     * @param {string} options.subscriptionId - ID of subscription to renew
     * @returns {Promise<Object>} Updated subscription with new expirationDateTime
     * @see https://learn.microsoft.com/en-us/graph/api/subscription-update
     * @example
     * await this.updateSubscription({
     *   subscriptionId: "abc123-def456"
     * });
     */
    updateSubscription({ subscriptionId } = {}) {
      const expirationDateTime = new Date(
        Date.now() + WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
      ).toISOString();
      return this.client().api(`/subscriptions/${subscriptionId}`)
        .patch({
          expirationDateTime,
        });
    },
    /**
     * Deletes a subscription. Call this when deactivating a webhook source
     * to stop receiving notifications and clean up resources.
     *
     * @param {Object} options - Delete options
     * @param {string} options.subscriptionId - ID of subscription to delete
     * @returns {Promise<void>}
     * @see https://learn.microsoft.com/en-us/graph/api/subscription-delete
     * @example
     * await this.deleteSubscription({
     *   subscriptionId: "abc123-def456"
     * });
     */
    deleteSubscription({ subscriptionId } = {}) {
      return this.client().api(`/subscriptions/${subscriptionId}`)
        .delete();
    },
  },
};
