import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pingone",
  propDefinitions: {
    username: {
      type: "string",
      label: "Username",
      description: "The user's username. This must either be a well-formed email address or another unique identifier.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
      optional: true,
    },
    givenName: {
      type: "string",
      label: "First Name",
      description: "The user's first name.",
      optional: true,
    },
    familyName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The user's department. E.g., `Engineering`.",
      optional: true,
    },
    locales: {
      type: "string[]",
      label: "Locales",
      description: "The user's locales. E.g., `London`.",
      optional: true,
      async options({ prevContext: { url } }) {
        if (url === null) {
          return [];
        }
        const {
          _embedded: { languages },
          _links: { next },
        } = await this.listLanguages({
          url,
        });
        return {
          options: languages.map(({ name }) => name),
          context: {
            url: next?.href || null,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user.",
      async options({ prevContext: { url } }) {
        if (url === null) {
          return [];
        }
        const {
          _embedded: { users },
          _links: { next },
        } = await this.listUsers({
          url,
        });
        return {
          options: users.map(({
            id: value, username: label,
          }) => ({
            label,
            value,
          })),
          context: {
            url: next?.href || null,
          },
        };
      },
    },
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The unique identifier for the application.",
      async options({ prevContext: { url } }) {
        if (url === null) {
          return [];
        }
        const {
          _embedded: { applications },
          _links: { next },
        } = await this.listApplications({
          url,
        });
        return {
          options: applications.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            url: next?.href || null,
          },
        };
      },
    },
    userAttributes: {
      type: "object",
      label: "User Attributes",
      description: "The attributes to update the user with.",
      optional: true,
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The unique identifier for the group.",
      optional: true,
    },
    status: {
      type: "string",
      label: "User Status",
      description: "The current status of the user, e.g., active, inactive.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${constants.ENV_PATH}/${this.$auth.environment_id}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, url, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: url || this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listApplications(args = {}) {
      return this._makeRequest({
        path: "/applications",
        ...args,
      });
    },
    listLanguages(args = {}) {
      return this._makeRequest({
        path: "/languages",
        ...args,
      });
    },
  },
};
