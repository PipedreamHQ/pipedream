import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "asin_data_api",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Collection",
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Determines whether the Collection is enabled; disabled Collections do not start automatically",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Determines the priority level of the Collection when multiple Collections are queued",
      optional: true,
      options: constants.PRIORITY_OPTIONS,
    },
    notificationEmail: {
      type: "string",
      label: "Notification Email",
      description: "Email address to receive notifications",
      optional: true,
    },
    notificationAsCsv: {
      type: "boolean",
      label: "Notification as CSV",
      description: "Determines whether results are sent in CSV format",
      optional: true,
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "Unique identifier of the Collection",
      async options() {
        const response = await this.listCollections();
        const collections = response.collections;
        return collections.map(({
          id,
          name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },

  },
  methods: {
    _baseUrl() {
      return "https://api.asindataapi.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          api_key: `${this.$auth.api_key}`,
          ...params,
        },
      });
    },
    async createCollection(args = {}) {
      return this._makeRequest({
        path: "/collections",
        method: "post",
        ...args,
      });
    },
    async updateCollection({
      collectionId, ...args
    }) {
      return this._makeRequest({
        path: `/collections/${collectionId}`,
        method: "put",
        ...args,
      });
    },
    async deleteCollection({
      collectionId, ...args
    }) {
      return this._makeRequest({
        path: `/collections/${collectionId}`,
        method: "delete",
        ...args,
      });
    },
    async listCollections(args = {}) {
      return this._makeRequest({
        path: "/collections",
        ...args,
      });
    },
  },
};
