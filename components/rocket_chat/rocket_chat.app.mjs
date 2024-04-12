import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "rocket_chat",
  propDefinitions: {
    username: {
      type: "string",
      label: "Recipient Username",
      description: "The username of the recipient for the direct message",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { users } = await this.listUsers({
          params: {
            count: limit,
            offset: page * limit,
          },
        });
        return users?.map(({
          username: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The identifier of a room",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { channels } = await this.listChannels({
          params: {
            count: limit,
            offset: page * limit,
          },
        });
        return channels?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/api/v1`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Auth-Token": this.$auth["X-Auth-Token"],
          "X-User-Id": this.$auth["X-User-Id"],
        },
        params: {
          ...params,
          userId: this.$auth["X-User-Id"],
        },
      });
    },
    listChannels(opts = {}) {
      return this._makeRequest({
        path: "/channels.list",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users.list",
        ...opts,
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/chat.syncMessages",
        ...opts,
      });
    },
    createChannel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/channels.create",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat.postMessage",
        ...opts,
      });
    },
    updateUserStatus(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users.setStatus",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
      resourceType,
      resourceSubType,
      max,
    }) {
      const limit = constants.DEFAULT_LIMIT;
      params = {
        ...params,
        count: limit,
        offset: 0,
      };
      let total, count = 0;
      do {
        const response = await resourceFn({
          params,
        });
        const items = resourceSubType
          ? response[resourceType][resourceSubType]
          : response[resourceType];
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
          total = items?.length;
          params.offset += limit;
        }
      } while (total === limit);
    },
  },
};
