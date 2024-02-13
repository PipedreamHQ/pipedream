import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "turbot_pipes",
  propDefinitions: {
    orgName: {
      type: "string",
      label: "Organization Name",
      description: "The name of the organization to create or delete",
    },
    orgDescription: {
      type: "string",
      label: "Organization Description",
      description: "The description of the organization to create",
      optional: true,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization to delete",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map((org) => ({
          label: org.title,
          value: org.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://pipes.turbot.com/api/latest";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createOrganization({
      orgName, orgDescription,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/orgs",
        data: {
          name: orgName,
          description: orgDescription,
        },
      });
    },
    async deleteOrganization({ organizationId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/orgs/${organizationId}`,
      });
    },
    async listOrganizations() {
      return this._makeRequest({
        path: "/orgs",
      });
    },
    async paginate(fn, opts = {}) {
      const results = [];
      let response;
      do {
        response = await fn({
          ...opts,
          params: {
            ...opts.params,
          },
        });
        results.push(...response.items);
        if (response.pagination && response.pagination.next) {
          opts.params.page = response.pagination.next;
        }
      } while (response.pagination && response.pagination.next);
      return results;
    },
  },
  version: "0.0.{{ts}}",
};
