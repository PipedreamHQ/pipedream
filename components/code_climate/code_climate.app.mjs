import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "code_climate",
  propDefinitions: {
    orgName: {
      type: "string",
      label: "Organization Name",
      description: "The name of the organization in Code Climate",
    },
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const { data } = await this.getOrganizations();

        return data.map(({
          id, attributes,
        }) => ({
          value: id,
          label: attributes.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.codeclimate.com/v1";
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
          "Accept": "application/vnd.api+json",
          "Authorization": `Token token=${this.$auth.personal_access_token}`,
        },
      });
    },
    async createOrganization(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/orgs",
        ...args,
      });
    },
    async getMembers({
      orgId, ...args
    }) {
      return this._makeRequest({
        path: `/orgs/${orgId}/members`,
        ...args,
      });
    },
    async getOrganizations(args = {}) {
      return this._makeRequest({
        path: "/orgs",
        ...args,
      });
    },
  },
};
