import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "roblox",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the Roblox user. This is the numeric ID found in the profile URL (e.g. `1` in `https://www.roblox.com/users/1/profile`).",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the Roblox group. This is the numeric ID found in the group URL (e.g. `1` in `https://www.roblox.com/groups/1`).",
    },
    universeId: {
      type: "string",
      label: "Universe ID",
      description: "The ID of the universe (experience). Find it in the [Creator Dashboard](https://create.roblox.com/dashboard/creations) under your experience's settings, or via the three-dot menu > **Copy Universe ID**.",
    },
    placeId: {
      type: "string",
      label: "Place ID",
      description: "The ID of the place within the universe. Find it in the [Creator Dashboard](https://create.roblox.com/dashboard/creations) via a place's three-dot menu > **Copy Place ID**.",
    },
    dataStoreId: {
      type: "string",
      label: "Data Store ID",
      description: "The name/ID of the data store. Run **List Data Stores** to find available data stores in a universe.",
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "The ID (key) of the data store entry. Run **List Data Store Entries** to find available entries.",
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter which resources are returned, using the API's [filtering syntax](https://create.roblox.com/docs/cloud/reference/patterns#filtering).",
      optional: true,
    },
    prefix: {
      type: "string",
      label: "ID Prefix",
      description: "Only return resources whose ID starts with this prefix.",
      optional: true,
    },
    users: {
      type: "string[]",
      label: "Users",
      description: "User IDs associated with the entry (for GDPR tracking). Format: `users/{user_id}`.",
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "An arbitrary set of attributes (metadata) to associate with the entry.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return (1-99999).",
      optional: true,
      default: constants.DEFAULT_MAX,
      min: 1,
      max: constants.MAX_RESULTS,
    },
  },
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${constants.CLOUD_PATH}`;
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {}, resourceKey, max = constants.DEFAULT_MAX,
    }) {
      const params = {
        ...args.params,
        maxPageSize: Math.min(max, constants.MAX_PAGE_SIZE),
      };
      let count = 0;
      let pageToken;
      do {
        const response = await resourceFn({
          ...args,
          params: {
            ...params,
            pageToken,
          },
        });
        const items = response[resourceKey] ?? [];
        for (const item of items) {
          yield item;
          if (++count >= max) {
            return;
          }
        }
        pageToken = response.nextPageToken;
      } while (pageToken);
    },
    async getPaginatedResults(args) {
      const results = [];
      for await (const item of this.paginate(args)) {
        results.push(item);
      }
      return results;
    },
    // Users
    getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        ...args,
      });
    },
    generateUserThumbnail({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}:generateThumbnail`,
        ...args,
      });
    },
    listInventoryItems({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}/inventory-items`,
        ...args,
      });
    },
    createUserNotification({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/notifications`,
        ...args,
      });
    },
    // Groups
    getGroup({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}`,
        ...args,
      });
    },
    listGroupMemberships({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/memberships`,
        ...args,
      });
    },
    listGroupRoles({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/roles`,
        ...args,
      });
    },
    // Universes
    getUniverse({
      universeId, ...args
    }) {
      return this._makeRequest({
        path: `/universes/${universeId}`,
        ...args,
      });
    },
    updateUniverse({
      universeId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/universes/${universeId}`,
        ...args,
      });
    },
    publishUniverseMessage({
      universeId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/universes/${universeId}:publishMessage`,
        ...args,
      });
    },
    restartUniverseServers({
      universeId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/universes/${universeId}:restartServers`,
        ...args,
      });
    },
    // Places
    getPlace({
      universeId, placeId, ...args
    }) {
      return this._makeRequest({
        path: `/universes/${universeId}/places/${placeId}`,
        ...args,
      });
    },
    updatePlace({
      universeId, placeId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/universes/${universeId}/places/${placeId}`,
        ...args,
      });
    },
    // Data stores
    listDataStores({
      universeId, ...args
    }) {
      return this._makeRequest({
        path: `/universes/${universeId}/data-stores`,
        ...args,
      });
    },
    listDataStoreEntries({
      universeId, dataStoreId, ...args
    }) {
      return this._makeRequest({
        path: `/universes/${universeId}/data-stores/${encodeURIComponent(dataStoreId)}/entries`,
        ...args,
      });
    },
    getDataStoreEntry({
      universeId, dataStoreId, entryId, ...args
    }) {
      return this._makeRequest({
        path: `/universes/${universeId}/data-stores/${encodeURIComponent(dataStoreId)}/entries/${encodeURIComponent(entryId)}`,
        ...args,
      });
    },
    setDataStoreEntry({
      universeId, dataStoreId, entryId, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/universes/${universeId}/data-stores/${encodeURIComponent(dataStoreId)}/entries/${encodeURIComponent(entryId)}`,
        ...args,
      });
    },
    deleteDataStoreEntry({
      universeId, dataStoreId, entryId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/universes/${universeId}/data-stores/${encodeURIComponent(dataStoreId)}/entries/${encodeURIComponent(entryId)}`,
        ...args,
      });
    },
    incrementDataStoreEntry({
      universeId, dataStoreId, entryId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/universes/${universeId}/data-stores/${encodeURIComponent(dataStoreId)}/entries/${encodeURIComponent(entryId)}:increment`,
        ...args,
      });
    },
  },
};
