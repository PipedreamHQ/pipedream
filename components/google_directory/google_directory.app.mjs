import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "google_directory",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "Identifier of a user",
      async options({ prevContext }) {
        const { nextPageToken: pageToken } = prevContext;
        const params = {
          customer: "my_customer",
          pageToken,
        };
        const {
          users, nextPageToken,
        } = await this.listUsers({
          params,
        });
        if (!users) {
          return;
        }
        const options = users.map(({
          id, name, primaryEmail,
        }) => ({
          label: name.fullName || primaryEmail,
          value: id,
        }));
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
    group: {
      type: "string",
      label: "Group",
      description: "Identifier of a group",
      async options({ prevContext }) {
        const { nextPageToken: pageToken } = prevContext;
        const params = {
          customer: "my_customer",
          pageToken,
        };
        const {
          groups, nextPageToken,
        } = await this.listGroups({
          params,
        });
        if (!groups) {
          return;
        }
        const options = groups.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://admin.googleapis.com/admin/directory/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getGroup({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}`,
        ...args,
      });
    },
    getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        ...args,
      });
    },
    listDomains(args = {}) {
      return this._makeRequest({
        path: "/customer/my_customer/domains",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    createGroup(args = {}) {
      return this._makeRequest({
        path: "/groups",
        method: "POST",
        ...args,
      });
    },
    addMemberToGroup({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/members`,
        method: "POST",
        ...args,
      });
    },
    createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
    async verifyEmail({
      email, ...args
    }) {
      const { domains } = await this.listDomains({
        ...args,
      });
      const domainNames = domains.map(({ domainName }) => domainName);

      const regex = /@([^\s@]+)/;
      const match = email.match(regex);
      const emailDomainName = match[1];

      if (!domainNames.includes(emailDomainName)) {
        throw new ConfigurationError(`The email domain name must be ${domainNames.length === 1
          ? "**" + domainNames[0] + "**"
          : "one of **" + domainNames.join(", ") + "**"}`);
      }
    },
    async *paginate({
      fn, params = {}, itemType, $,
    }) {
      do {
        const response = await fn({
          params,
          $,
        });
        const items = response[itemType];
        if (!items?.length) {
          return;
        }
        for (const d of items) {
          yield d;
        }
        params.pageToken = response?.nextPageToken;
      } while (params.pageToken);
    },
  },
};
