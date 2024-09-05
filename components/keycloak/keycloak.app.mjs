import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "keycloak",
  propDefinitions: {
    realm: {
      type: "string",
      label: "Realm",
      description: "The realm name (not id) to which the user belongs.",
      async options() {
        const realms = await this.listRealms({
          params: {
            briefRepresentation: true,
          },
        });
        return realms.map(({ realm }) => realm);
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user.",
      async options({ realm }) {
        if (!realm) {
          return [];
        }
        const users = await this.listUsers({
          realm,
          params: {
            briefRepresentation: true,
          },
        });
        return users.map(({
          id: value, username: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the user.",
      optional: true,
    },
    emailVerified: {
      type: "boolean",
      label: "Email Verified",
      description: "Whether the user's email is verified.",
      optional: true,
    },
    enabled: {
      type: "boolean",
      label: "Enabled",
      description: "Whether the user is enabled.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.url}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    listRealms(args = {}) {
      return this._makeRequest({
        path: "/admin/realms",
        ...args,
      });
    },
    listUsers({
      realm, ...args
    } = {}) {
      return this._makeRequest({
        path: `/admin/realms/${realm}/users`,
        ...args,
      });
    },
    listEvents({
      realm, ...args
    } = {}) {
      return this._makeRequest({
        debug: true,
        path: `/admin/realms/${realm}/events`,
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs,
      max = constants.DEFAULT_MAX,
    }) {
      let first = 0;
      let resourcesCount = 0;

      while (true) {
        const nextResources =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              max: constants.DEFAULT_LIMIT,
              first,
            },
          });

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        first += constants.DEFAULT_LIMIT;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
