import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agendor",
  propDefinitions: {
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of the person to retrieve.",
      async options(prevContext) {
        const persons = await this.listPersons(prevContext.page + 1);
        return persons.data.map((person) => ({
          label: person.name,
          value: person.id,
        }));
      },
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization to retrieve.",
      async options(prevContext) {
        const organizations = await this.listOrganizations(prevContext.page + 1);
        return organizations.data.map((organization) => ({
          label: organization.name,
          value: organization.id,
        }));
      },
    },
  },
  methods: {
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getBaseUrl() {
      return "https://api.agendor.com.br/v3";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Token ${this._getApiToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async getPerson(personId) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/people/${personId}`,
      });
    },
    async listPersons(page) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/people",
        params: {
          page,
          per_page: 100,
        },
      });
    },
    async listOrganizations(page) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/organizations",
        params: {
          page,
          per_page: 100,
        },
      });
    },
    async getOrganization(organizationId) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/organizations/${organizationId}`,
      });
    },
  },
};
