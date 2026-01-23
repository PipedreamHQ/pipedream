import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chatforma",
  propDefinitions: {
    botId: {
      type: "string",
      label: "Bot ID",
      description: "The unique identifier of the bot",
      async options() {
        const bots = await this.listBots();
        return bots.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    segmentId: {
      type: "string",
      label: "Segment ID",
      description: "The unique identifier of the segment. If 0, the broadcast will be sent to all users in the bot.",
      async options({ botId }) {
        const segments = await this.listSegments({
          botId,
        });
        return segments.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    botUserId: {
      type: "string",
      label: "Bot User ID",
      description: "The unique identifier of the bot user",
      async options({ botId }) {
        const botUsers = await this.listBotUsers({
          botId,
        });
        return botUsers.map(({
          id: value, first_name: fName, last_name: lName,
        }) => ({
          label: `${fName} ${lName}`,
          value,
        })) || [];
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The unique identifier of the form",
      async options({ botId }) {
        const forms = await this.listForms({
          params: {
            botId,
          },
        });
        return forms.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the message to broadcast",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pro.chatforma.com/public/v1";
    },
    _headers() {
      return {
        "api_key": this.$auth.api_key,
        "Content-Type": "application/json",
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
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    listBots(opts = {}) {
      return this._makeRequest({
        path: "/bots",
        ...opts,
      });
    },
    listBotUsers({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/bots/${botId}/users`,
        ...opts,
      });
    },
    listSegments({
      botId, ...opts
    }) {
      return this._makeRequest({
        path: `/bots/${botId}/segments`,
        ...opts,
      });
    },
    dispatchUserBroadcast({
      botId, botUserId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bots/${botId}/dispatch/user/${botUserId}`,
        ...opts,
      });
    },
    dispatchSegmentBroadcast({
      botId, segmentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bots/${botId}/segments/${segmentId}/dispatch`,
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribe-notification",
        ...opts,
      });
    },
    deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/unsubscribe-notification",
        ...opts,
      });
    },
  },
};
