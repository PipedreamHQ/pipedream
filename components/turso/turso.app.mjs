import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "turso",
  propDefinitions: {
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "Name of the organization",
      async options() {
        const orgNames = await this.getOrganizations({});
        return orgNames.map(({ slug }) => ({
          value: slug,
        }));
      },
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description: "Name of the groups",
      async options({ organizationName }) {
        const response = await this.getGroups({
          organizationName,
        });
        const groupsNames = response.groups;
        return groupsNames.map(({ name }) => ({
          value: name,
        }));
      },
    },
    databaseName: {
      type: "string",
      label: "Database Name",
      description: "Name of the database",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.turso.tech/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createDatabase({
      organizationName, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/organizations/${organizationName}/databases`,
        ...args,
      });
    },
    async getDatabases({
      organizationName, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationName}/databases`,
        ...args,
      });
    },
    async getGroups({
      organizationName, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationName}/groups`,
        ...args,
      });
    },
    async getOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
  },
};
