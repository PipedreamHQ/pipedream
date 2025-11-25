import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "encharge",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID of the person to update.",
      async options({ page }) {
        const { people } = await this.listPeople({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return people.map(({
          id: value, name, email,
        }) => ({
          label: `${name}${email
            ? ` (${email})`
            : ""}`,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to remove from the person.",
      async options({ userId }) {
        const {
          users: [
            { tags },
          ],
        } = await this.getPerson({
          params: {
            people: [
              {
                id: userId,
              },
            ],
          },
        });
        return tags
          ? tags.split(",")
          : [];
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.encharge.io/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    getPerson(args = {}) {
      return this._makeRequest({
        path: "people",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this._makeRequest({
        path: "people/all",
        ...args,
      });
    },
    addOrUpdatePerson(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "people",
        ...args,
      });
    },
    archivePerson(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "people",
        ...args,
      });
    },
    removeTag(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "tags",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "event-subscriptions",
        ...args,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `event-subscriptions/${hookId}`,
      });
    },
  },
};
