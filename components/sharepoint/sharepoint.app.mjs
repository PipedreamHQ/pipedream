import { axios } from "@pipedream/platform";
import { Client } from "@microsoft/microsoft-graph-client";
import retry from "async-retry";
import "isomorphic-fetch";
import { WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS } from "./common/constants.mjs";

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
    _graphClient: null,
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
      if (!this._graphClient) {
        this._graphClient = Client.initWithMiddleware({
          authProvider: {
            getAccessToken: () => Promise.resolve(this._getAccessToken()),
          },
        });
      }
      return this._graphClient;
    },
    /**
     * Makes a request to Microsoft Graph API with automatic retry logic.
     * Retries on transient errors (5xx, 429) but not on auth/client
     * errors (4xx).
     *
     * @param {Object} options - Request options
     * @param {string} options.path - API path (e.g., "/sites/{siteId}")
     * @param {string} [options.method="GET"] - HTTP method
     * @param {*} [options.content] - Request body for POST/PATCH
     * @param {number} [options.retries=3] - Number of retry attempts
     * @returns {Promise<*>} API response
     */
    async graphRequest({
      path, method = "GET", content, retries = 3,
    }) {
      return retry(
        async (bail) => {
          try {
            const api = this.client().api(path);

            switch (method.toUpperCase()) {
            case "GET":
              return await api.get();
            case "POST":
              return await api.post(content);
            case "PATCH":
              return await api.patch(content);
            case "DELETE":
              return await api.delete();
            default:
              throw new Error(`Unsupported HTTP method: ${method}`);
            }
          } catch (error) {
            // Don't retry on auth errors or client errors (4xx except 429)
            const status = error.statusCode || error.response?.status;
            if ([
              400,
              401,
              403,
              404,
            ].includes(status)) {
              bail(error); // Throw immediately, don't retry
              return;
            }
            throw error; // Retry on other errors
          }
        },
        {
          retries,
          minTimeout: 1000,
          maxTimeout: 10000,
          onRetry: (error, attempt) => {
            console.log(`Retry attempt ${attempt} after error: ${error.message}`);
          },
        },
      );
    },
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    _headers(headers) {
      return {
        Authorization: `Bearer ${this._getAccessToken()}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this,
      path,
      url,
      headers,
      ...args
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    /**
     * Makes a request to SharePoint REST API (not Microsoft Graph).
     * Use this for SharePoint-specific features not available in Graph API,
     * such as native SharePoint site groups.
     *
     * @param {Object} options - Request options
     * @param {string} options.siteWebUrl - Full site URL (e.g., "https://tenant.sharepoint.com/sites/MySite")
     * @param {string} options.path - REST API path (e.g., "/web/sitegroups")
     * @param {Object} [options.headers] - Additional headers
     * @returns {Promise<Object>} API response
     * @example
     * // Get SharePoint site groups
     * await this._makeSharePointRestRequest({
     *   siteWebUrl: "https://contoso.sharepoint.com/sites/TeamSite",
     *   path: "/web/sitegroups"
     * })
     */
    _makeSharePointRestRequest({
      $ = this,
      siteWebUrl,
      path,
      headers,
      ...args
    }) {
      // SharePoint REST API uses the site's webUrl as base
      // e.g., https://tenant.sharepoint.com/sites/MySite/_api/web/sitegroups
      const baseUrl = siteWebUrl.replace(/\/$/, ""); // Remove trailing slash if present
      return axios($, {
        url: `${baseUrl}/_api${path}`,
        headers: this._headers({
          Accept: "application/json;odata=verbose",
          ...headers,
        }),
        ...args,
      });
    },
    getSite({
      siteId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}`,
        ...args,
      });
    },
    /**
     * Lists SharePoint-native site groups using the SharePoint REST API.
     * These are different from Microsoft 365 Groups and can only be accessed via REST API.
     *
     * @param {Object} options - Request options
     * @param {string} options.siteWebUrl - Full site URL
     * @returns {Promise<Object>} Response with groups in d.results array
     * @example
     * const groups = await this.listSharePointSiteGroups({
     *   siteWebUrl: "https://contoso.sharepoint.com/sites/TeamSite"
     * });
     * // Returns: { d: { results: [{ Id: 5, Title: "Team Site Members" }, ...] } }
     */
    listSharePointSiteGroups({
      siteWebUrl, ...args
    }) {
      return this._makeSharePointRestRequest({
        siteWebUrl,
        path: "/web/sitegroups",
        ...args,
      });
    },
    /**
     * Gets members of a SharePoint-native site group using the SharePoint REST API.
     * Returns user details including email, display name, and login name.
     *
     * @param {Object} options - Request options
     * @param {string} options.siteWebUrl - Full site URL
     * @param {number} options.groupId - SharePoint group ID
     * @returns {Promise<Object>} Response with users in d.results array
     * @example
     * const members = await this.getSharePointSiteGroupMembers({
     *   siteWebUrl: "https://contoso.sharepoint.com/sites/TeamSite",
     *   groupId: 5
     * });
     * // Returns: { d: { results: [{ Email: "user@contoso.com", Title: "John Doe" }, ...] } }
     */
    getSharePointSiteGroupMembers({
      siteWebUrl, groupId, ...args
    }) {
      return this._makeSharePointRestRequest({
        siteWebUrl,
        path: `/web/sitegroups/getbyid(${groupId})/users`,
        ...args,
      });
    },
    listSites(args = {}) {
      return this._makeRequest({
        path: "/me/followedSites",
        ...args,
      });
    },
    listAllSites({
      params = {}, ...args
    } = {}) {
      if (!params.search) {
        params.search = "*";
      }
      return this._makeRequest({
        path: "/sites",
        params,
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
    getListItem({
      siteId, listId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/lists/${listId}/items/${itemId}`,
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
        path: `/sites/${siteId}/drives/${driveId}/root/children`,
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
        path: `/sites/${siteId}/drives/${driveId}/root/children`,
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
          "Authorization": `Bearer ${this._getAccessToken()}`,
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
    listDriveItemPermissions({
      driveId, itemId, ...args
    }) {
      return this._makeRequest({
        path: `/drives/${driveId}/items/${itemId}/permissions`,
        ...args,
      });
    },
    searchDriveItems({
      siteId, query, ...args
    }) {
      return this._makeRequest({
        path: `/sites/${siteId}/drive/root/search(q='${encodeURIComponent(
          query,
        )}')`,
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
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listGroupMembers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members`,
        ...args,
      });
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
      driveId, deltaLink, ...args
    }) {
      // If we have a deltaLink/nextLink, use it as full URL; otherwise build path
      if (deltaLink) {
        return this._makeRequest({
          url: deltaLink,
          ...args,
        });
      }
      return this._makeRequest({
        path: `/drives/${driveId}/root/delta`,
        ...args,
      });
    },
    searchQuery(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/search/query",
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
      resource, notificationUrl, changeType = "updated", clientState, ...args
    }) {
      const expirationDateTime = new Date(
        Date.now() + WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
      ).toISOString();

      return this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        data: {
          changeType,
          notificationUrl,
          resource,
          expirationDateTime,
          clientState,
        },
        ...args,
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
    updateSubscription({
      subscriptionId, ...args
    }) {
      const expirationDateTime = new Date(
        Date.now() + WEBHOOK_SUBSCRIPTION_EXPIRATION_TIME_MILLISECONDS,
      ).toISOString();

      return this._makeRequest({
        method: "PATCH",
        path: `/subscriptions/${subscriptionId}`,
        data: {
          expirationDateTime,
        },
        ...args,
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
    deleteSubscription({
      subscriptionId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/subscriptions/${subscriptionId}`,
        ...args,
      });
    },
  },
};
