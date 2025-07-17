import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "apify",
  propDefinitions: {
    keyValueStoreId: {
      type: "string",
      label: "Key-Value Store Id",
      description: "The Id of the key-value store.",
      async options({ page }) {
        const { data: { items } } = await this.listKeyValueStores({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
            unnamed: true,
          },
        });

        return items.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    actorId: {
      type: "string",
      label: "Actor ID",
      description: "Actor ID or a tilde-separated owner's username and Actor name",
      async options({ page }) {
        const { data: { items } } = await this.listActors({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userActorId: {
      type: "string",
      label: "Actor ID",
      description: "The ID of the Actor to monitor.",
      async options({ page }) {
        const { data: { items } } = await this.listUserActors({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to monitor.",
      async options({ page }) {
        const { data: { items } } = await this.listTasks({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The ID of the dataset to retrieve items within",
      async options({ page }) {
        const { data: { items } } = await this.listDatasets({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    buildId: {
      type: "string",
      label: "Build",
      description: "Specifies the Actor build to run. It can be either a build tag or build number.",
      async options({
        page, actorId,
      }) {
        const { data: { items } } = await this.listBuilds({
          actorId,
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });
        return items?.map(({ id }) => id) || [];
      },
    },
    clean: {
      type: "boolean",
      label: "Clean",
      description: "Return only non-empty items and skips hidden fields (i.e. fields starting with the # character)",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "An array of fields which should be picked from the items, only these fields will remain in the resulting record objects.",
      optional: true,
    },
    omit: {
      type: "string[]",
      label: "Omit",
      description: "An array of fields which should be omitted from the items",
      optional: true,
    },
    flatten: {
      type: "string[]",
      label: "Flatten",
      description: "An array of fields which should transform nested objects into flat structures. For example, with `flatten=\"foo\"` the object `{\"foo\":{\"bar\": \"hello\"}}` is turned into `{\"foo.bar\": \"hello\"}`",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of items to return",
      default: LIMIT,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.apify.com/v2";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "x-apify-integration-platform": "pipedream",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    runActor({
      actorId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/acts/${actorId}/run-sync`,
        ...opts,
      });
    },
    runActorAsynchronously({
      actorId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/acts/${actorId}/runs`,
        ...opts,
      });
    },
    runTask({ taskId }) {
      return this._makeRequest({
        method: "POST",
        path: `/actor-tasks/${taskId}/runs`,
      });
    },
    getBuild(build) {
      return this._makeRequest({
        path: `/actor-builds/${build}`,
      });
    },
    listActors(opts = {}) {
      return this._makeRequest({
        path: "/store",
        ...opts,
      });
    },
    listUserActors(opts = {}) {
      return this._makeRequest({
        path: "/acts",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/actor-tasks",
        ...opts,
      });
    },
    listBuilds({ actorId }) {
      return this._makeRequest({
        path: `/acts/${actorId}/builds`,
      });
    },
    listKeyValueStores(opts = {}) {
      return this._makeRequest({
        path: "/key-value-stores",
        ...opts,
      });
    },
    listDatasets(opts = {}) {
      return this._makeRequest({
        path: "/datasets",
        ...opts,
      });
    },
    listDatasetItems({
      datasetId, ...opts
    }) {
      return this._makeRequest({
        path: `/datasets/${datasetId}/items`,
        ...opts,
      });
    },
    runTaskSynchronously({
      taskId, ...opts
    }) {
      return this._makeRequest({
        path: `/actor-tasks/${taskId}/run-sync-get-dataset-items`,
        ...opts,
      });
    },
    setKeyValueStoreRecord({
      storeId, recordKey, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/key-value-stores/${storeId}/records/${recordKey}`,
        ...opts,
      });
    },
  },
};
