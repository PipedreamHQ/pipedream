import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "workiom",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of the app",
      async options() {
        const { result: { items } } = await this.getApps();

        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list where the record will be created",
      async options({ appId }) {
        const { result: { items } } = await this.getApps({
          params: {
            "withListsAndMainFields": true,
          },
        });

        const resposne = items.find(({ id }) => id === appId);
        return resposne.lists?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update",
      async options({
        listId, page,
      }) {
        const { result: { items } } = await this.getListRecords({
          data: {
            listId,
            maxResultCount: LIMIT,
            skipCount: LIMIT * page,
          },
        });
        return items?.map(({ _id }) => _id);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.workiom.com/api/services/app";
    },
    _headers() {
      return {
        "X-Api-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "accept": "text/plain",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getApps(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/Apps/GetAll",
        ...opts,
      });
    },
    getListRecords(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Data/All",
        ...opts,
      });
    },
    createRecord(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Data/Create",
        ...opts,
      });
    },
    updateRecord(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/Data/UpdatePartial",
        ...opts,
      });
    },
    getListMetadata(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/Lists/Get",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/WebhookSubscription/AddSubscription",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/WebhookSubscription/DeleteSubscription",
        ...opts,
      });
    },
  },
};
