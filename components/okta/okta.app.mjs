import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "okta",
  propDefinitions: {
    typeId: {
      type: "string",
      label: "Type Id",
      description: "The ID of the user type. Add this value if you want to create a user with a non-default user type. The user type determines which schema applies to that user. After a user has been created, the user can only be assigned a different user type by an administrator through a full replacement (PUT) operation.",
      async options() {
        const data = await this.listUserTypes();

        return data.map(({
          id: value, displayName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    groupIds: {
      type: "string[]",
      label: "Group Ids",
      description: "An array of group Ids.",
      async options({ prevContext = {} }) {
        let after = "";
        if (prevContext.nextToken) {
          after = prevContext.nextToken;
        }
        const data = await this.listGroups({
          params: {
            limit: LIMIT,
            after,
          },
        });

        return {
          options: data.map(({
            id: value, profile: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            nextToken: data[data.length - 1].id,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user.",
      async options({ prevContext }) {
        let after = "";
        if (prevContext.nextToken) {
          after = prevContext.nextToken;
        }
        const data = await this.listUsers({
          params: {
            limit: LIMIT,
            after,
          },
        });

        return {
          options: data.map(({
            id: value, profile: { email: label },
          }) => ({
            label,
            value,
          })),
          context: {
            nextToken: data[data.length - 1].id,
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user.",
    },
    login: {
      type: "string",
      label: "Login",
      description: "The login for the user.",
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The mobile phone number of the user.",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.okta.com/api/v1`;
    },
    _headers() {
      return {
        "Authorization": `SSWS ${this.$auth.api_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json; okta-version=1.0.0",
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
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        ...opts,
      });
    },
    listUserTypes() {
      return this._makeRequest({
        path: "/meta/types/user",
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listLogs(opts = {}) {
      return this._makeRequest({
        path: "/logs",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    updateUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/users/${userId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let after = null;

      do {
        params.after = after;
        const {
          headers: { link }, data,
        } = await fn({
          returnFullResponse: true,
          params,
          ...opts,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        const nextToken = link.match(/after=(\w+)/);
        if (nextToken) {
          after = nextToken[1];
        }

        hasMore = nextToken;

      } while (hasMore);
    },
  },
};
