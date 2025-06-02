import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "beekeeper",
  propDefinitions: {
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of the chat to send a message",
      async options() {
        const { chats } = await this.listChats();
        return chats.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    streamId: {
      type: "string",
      label: "Stream ID",
      description: "The ID of the stream to create a post",
      async options() {
        const streams = await this.listStreams();
        return streams.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID for profile details",
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });
        return users.map(({
          id: value, display_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    mentions: {
      type: "string[]",
      label: "Mentions",
      description: "IDs of the users mentioned in the message body. Can also have value of 'all', which means all the chat members were mentioned.",
      async options({ chatId }) {
        const members = await this.listChatMembers({
          chatId,
        });
        return [
          {
            label: "All Members",
            value: "all",
          },
          ...members.map(({
            id: value, display_name: label,
          }) => ({
            label,
            value,
          })),
        ];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.beekeeper.io/api/2`;
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.access_token}`,
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
    listChats(opts = {}) {
      return this._makeRequest({
        path: "/chats/groups",
        ...opts,
      });
    },
    listStreams(opts = {}) {
      return this._makeRequest({
        path: "/streams",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    async listChatMembers({
      chatId, ...opts
    }) {
      const { members } = await this._makeRequest({
        path: `/chats/groups/${chatId}/members`,
        ...opts,
      });

      return await this.listUserProfiles({
        params: {
          user_ids: members.map(({ user_id }) => user_id),
        },
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        ...opts,
      });
    },
    sendMessage({
      chatId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/chats/groups/${chatId}/messages`,
        ...opts,
      });
    },
    listUserProfiles(opts = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...opts,
      });
    },
    getUserProfile({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/profiles/${userId}`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
