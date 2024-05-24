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
      description: "The ID of the actor to run.",
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
      description: "The ID of the actor to monitor.",
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
  },
  methods: {
    _baseUrl() {
      return "https://api.apify.com/v2";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
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
    listBuilds(actorId) {
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
