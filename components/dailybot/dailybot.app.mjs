import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "dailybot",
  propDefinitions: {
    targetUsers: {
      type: "string[]",
      label: "Target User IDs",
      description: "The IDs of the target users.",
      async options({ page }) {
        const { results } = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return results.map(({
          uuid: value, full_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    targetTeams: {
      type: "string[]",
      label: "Target Teams IDs",
      description: "The IDs of the target teams. All members involved in those teams will receive the message.",
      async options({ page }) {
        const { results } = await this.listTeams({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return results.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the message.",
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
      return "https://api.dailybot.com/v1";
    },
    _headers() {
      return {
        "X-API-KEY": `${this.$auth.api_key}`,
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
    sendKudos(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/kudos/",
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams/",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users/",
        ...opts,
      });
    },
    dispatchMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/send-message/",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook-subscription/",
        ...opts,
      });
    },
    deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhook-subscription/",
        ...opts,
      });
    },
  },
};
