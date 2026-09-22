import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flock",
  propDefinitions: {
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel to send the message to. Example: `g:696105_announcements`",
      async options() {
        const channels = await this.listChannels();
        return channels?.map((channel) => ({
          label: channel.name,
          value: channel.id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to send the message to. Example: `u:qummtqqmvyy68qm6`. Enter manually or select a channel ID to list members.",
      async options({ channelId }) {
        if (!channelId) return [];
        const members = await this.listChannelMembers({
          params: {
            channelId,
          },
        });
        return members?.map(({
          userId, publicProfile,
        }) => {
          const firstName = publicProfile?.firstName;
          const lastName = publicProfile?.lastName;
          const label = lastName
            ? (firstName
              ? `${firstName} ${lastName}`
              : lastName)
            : userId;
          return {
            label,
            value: userId,
          };}) || [];
      },
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the message to send",
      optional: true,
    },
    flockml: {
      type: "string",
      label: "FlockML",
      description: "[FlockML](https://docs.flock.com/display/flockos/FlockML) alternative to message text. If present this will be shown instead of message text.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flock.co/v1";
    },
    _makeRequest({
      $ = this, params, ...opts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          token: this.$auth.token,
          ...params,
        },
        ...opts,
      });
    },
    listChannels(opts = {}) {
      return this._makeRequest({
        url: "/channels.list",
        ...opts,
      });
    },
    listChannelMembers(opts = {}) {
      return this._makeRequest({
        url: "/channels.listMembers",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        url: "/chat.sendMessage",
        ...opts,
      });
    },
  },
};
