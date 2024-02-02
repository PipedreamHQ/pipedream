import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dailybot",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization.",
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form.",
    },
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "The ID of the kudos sender.",
    },
    receiverId: {
      type: "string",
      label: "Receiver ID",
      description: "The ID of the kudos receiver.",
    },
    targetUsers: {
      type: "string[]",
      label: "Target User IDs",
      description: "The IDs of the target users.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message.",
      optional: true,
    },
    recipientsIds: {
      type: "string[]",
      label: "Recipients' IDs",
      description: "The IDs of the message recipients.",
    },
    channelsOrRooms: {
      type: "string[]",
      optional: true,
      label: "Channels or Rooms",
      description: "The IDs of the channels or rooms to target, if any.",
    },
    isAnonymous: {
      type: "boolean",
      label: "Is Anonymous",
      description: "Send the kudos anonymously.",
      optional: true,
    },
    byDailyBot: {
      type: "boolean",
      label: "By DailyBot",
      description: "Send the kudos on behalf of DailyBot.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dailybot.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async sendKudos({
      receivers, content, isAnonymous = false, byDailyBot = false,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/kudos/",
        data: {
          receivers,
          content,
          is_anonymous: isAnonymous,
          by_dailybot: byDailyBot,
        },
      });
    },
    async dispatchMessage({
      messageContent, recipientsIds, channelsOrRooms,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/send-message/",
        data: {
          message: messageContent,
          target_users: recipientsIds,
          target_channels: channelsOrRooms
            ? channelsOrRooms.map((id) => ({
              id,
              is_channel_message: true,
            }))
            : [],
        },
      });
    },
  },
};
