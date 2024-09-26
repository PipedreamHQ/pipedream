import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dopplerai",
  propDefinitions: {
    chatUuid: {
      type: "string",
      label: "Chat UUID",
      description: "The UUID of the chat that the message will belong to",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          skip: page * limit,
        };
        const chats = await this.listChats({
          params,
        });
        return chats?.map(({
          uuid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    collectionUuid: {
      type: "string",
      label: "Collection UUID",
      description: "The UUID of the collection to extract embeddings from",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          skip: page * limit,
        };
        const collections = await this.listCollections({
          params,
        });
        return collections?.map(({
          uuid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    referenceId: {
      type: "string",
      label: "Reference ID",
      description: "An optional reference ID for your own reference",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "An optional name for your own reference",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dopplerai.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    listChats(opts = {}) {
      return this._makeRequest({
        path: "/chats",
        ...opts,
      });
    },
    listCollections(opts = {}) {
      return this._makeRequest({
        path: "/collections",
        ...opts,
      });
    },
    createChat(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chats",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    createCollection(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/collections",
        ...opts,
      });
    },
  },
};
