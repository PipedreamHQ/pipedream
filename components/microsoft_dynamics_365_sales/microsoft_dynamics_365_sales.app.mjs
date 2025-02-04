import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_dynamics_365_sales",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The identifier of a contact",
      optional: true,
      async options() {
        const { value } = await this.listContacts();
        return value?.map(({
          contactid: value, fullname: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    solutionId: {
      type: "string",
      label: "Solution ID",
      description: "Identifier of a solution",
      async options() {
        const { value } = await this.listSolutions();
        return value?.filter(({ isvisible }) => isvisible)?.map(({
          solutionid: value, uniquename, friendlyname,
        }) => ({
          value,
          label: friendlyname || uniquename,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.org_domain}.crm.dynamics.com/api/data/v9.2`;
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "odata-maxversion": "4.0",
          "odata-version": "4.0",
          "content-type": "application/json",
          "If-None-Match": null,
        },
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    getPublisher({
      publisherId, ...opts
    }) {
      return this._makeRequest({
        path: `/publishers(${publisherId})`,
        ...opts,
      });
    },
    getSolution({
      solutionId, ...opts
    }) {
      return this._makeRequest({
        path: `/solutions(${solutionId})`,
        ...opts,
      });
    },
    listSolutions(opts = {}) {
      return this._makeRequest({
        path: "/solutions",
        ...opts,
      });
    },
    getEntity({
      entityId, ...opts
    }) {
      return this._makeRequest({
        path: `/${entityId}`,
        ...opts,
      });
    },
    createCustomEntity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/EntityDefinitions",
        ...opts,
      });
    },
  },
};
