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
    },
    channelId: {
      type: "integer",
      label: "Channel ID",
      description: "ID of the Channel recipient of the message. Required when type is `channel` or `stream`",
      optional: true,
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic of the message",
      optional: true,
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
          ...auth,
          username: `${this.$auth.email}`,
          password: `${this.$auth.api_key}`,
        },
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
