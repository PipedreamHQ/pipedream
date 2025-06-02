import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "beekeeper",
  propDefinitions: {
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of the chat to send a message",
      async options() {
        const chats = await this.listChats();
        return chats.map((chat) => ({
          label: chat.name,
          value: chat.id,
        }));
      },
    },
    streamId: {
      type: "string",
      label: "Stream ID",
      description: "The ID of the stream to create a post",
      async options() {
        const streams = await this.listStreams();
        return streams.map((stream) => ({
          label: stream.name,
          value: stream.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID for profile details",
      async options() {
        const users = await this.listUsers();
        return users.map((user) => ({
          label: user.display_name,
          value: user.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.beekeeper.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listChats(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/chats",
        ...opts,
      });
    },
    async listStreams(opts = {}) {
      return this._makeRequest({
        path: "/streams",
        ...opts,
      });
    },
    async listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    async createPost({
      streamId, files, locked, title, media, labels, sticky, photos, reactionsDisabled, text, options, scheduledAt,
    }) {
      const data = {
        files,
        locked,
        title,
        media,
        labels,
        sticky,
        photos,
        reactions_disabled: reactionsDisabled,
        text,
        options,
        scheduled_at: scheduledAt,
      };
      return this._makeRequest({
        method: "POST",
        path: `/streams/${streamId}/posts`,
        data,
      });
    },
    async sendMessage({
      chatId, body, attachment, eventType, chatStateAddons, messageAddons, refersTo, mentions,
    }) {
      const data = {
        body,
        attachment,
        event: {
          type: eventType,
        },
        chat_state_addons: chatStateAddons,
        message_addons: messageAddons,
        refers_to: refersTo,
        mentions,
      };
      return this._makeRequest({
        method: "POST",
        path: `/api/2/chats/groups/${chatId}/messages`,
        data,
      });
    },
    async getUserProfile({
      userId, includeActivities, includeTotals,
    }) {
      return this._makeRequest({
        path: `/profiles/${userId}`,
        params: {
          include_activities: includeActivities,
          include_totals: includeTotals,
        },
      });
    },
  },
};
