import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zulip",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "The type of message to be sent",
      options: constants.TYPE_OPTIONS,
    },
    userId: {
      type: "integer[]",
      label: "User ID",
      description: "ID of the Users recipients of the message. Required when type is `direct` or `private`",
      optional: true,
      async options() {
        const response = await this.getUsers();
        const usersIds = response.members;
        return usersIds.map(({
          user_id, full_name,
        }) => ({
          label: full_name,
          value: user_id,
        }));
      },
    },
    channelId: {
      type: "integer",
      label: "Channel ID",
      description: "ID of the Channel recipient of the message. Required when type is `channel` or `stream`",
      optional: true,
      async options() {
        const response = await this.getChannels();
        const channelsIds = response.streams;
        return channelsIds.map(({
          stream_id, name,
        }) => ({
          label: name,
          value: stream_id,
        }));
      },
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic of the message. Required when type is `channel` or `stream`",
      optional: true,
      async options({ channelId }) {
        const response = await this.getTopics({
          channelId,
        });
        const topics = response.topics;
        return topics.map(({ name }) => ({
          label: name,
          value: name,
        }));
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.zulipchat.com/api/v1`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.email}`,
          password: `${this.$auth.api_key}`,
          ...auth,
        },
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getChannels(args = {}) {
      return this._makeRequest({
        path: "/streams",
        ...args,
      });
    },
    async getTopics({
      channelId, ...args
    }) {
      return this._makeRequest({
        path: `/users/me/${channelId}/topics`,
        ...args,
      });
    },
    async sendMessage(args = {}) {
      return this._makeRequest({
        path: "/messages",
        method: "post",
        ...args,
      });
    },
  },
};
