import { axios } from "@pipedream/platform";
import { pageSize } from "./common/constants.mjs";

export default {
  type: "app",
  app: "gotowebinar",
  propDefinitions: {
    organizerKey: {
      type: "string",
      label: "Organizer Key",
      description: "The key of the organizer",
      async options({ page }) {
        const { results } = await this.listUsers({
          params: {
            offset: page * pageSize,
          },
        });

        return results.map(({
          key: value, email, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
        }));
      },
    },
    webinarKey: {
      type: "string",
      label: "Webinar Key",
      description: "The key of the webinar",
      async options({ page }) {
        const { _embedded } = await this.listWebinars({
          params: {
            page,
            size: 1,
            fromTime: "1970-01-01T00:00:00Z",
            toTime: "3000-12-31T23:59:59Z",
          },
        });

        return _embedded?.webinars?.map(({
          webinarKey: value, subject: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _apiUrl(api) {
      switch (api) {
      case "admin": return "https://api.getgo.com/admin/rest/v1";
      default: return "https://api.getgo.com/G2W/rest/v2";
      }
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, api, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl(api)}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    _getMe() {
      return this._makeRequest({
        api: "admin",
        path: "me",
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        ...args,
      });
    },
    createRegistrant({
      organizerKey, webinarKey, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `organizers/${organizerKey}/webinars/${webinarKey}/registrants`,
        ...args,
      });
    },
    createUserSubscription(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "userSubscriptions",
        ...args,
      });
    },
    createWebinar({
      organizerKey, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `organizers/${organizerKey}/webinars`,
        ...args,
      });
    },
    deleteHook(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "webhooks",
        ...args,
      });
    },
    deleteUserSubscription(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "userSubscriptions",
        ...args,
      });
    },
    listFields({
      organizerKey, webinarKey, ...args
    }) {
      return this._makeRequest({
        path: `organizers/${organizerKey}/webinars/${webinarKey}/registrants/fields`,
        ...args,
      });
    },
    async listUsers(args = {}) {
      const { accountKey } = await this._getMe();
      return this._makeRequest({
        api: "admin",
        path: `accounts/${accountKey}/users`,
        ...args,
      });
    },
    listWebinars({
      organizerKey, ...args
    }) {
      return this._makeRequest({
        path: `organizers/${organizerKey}/webinars`,
        ...args,
      });
    },
    updateHook(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "webhooks",
        ...args,
      });
    },
  },
};
