import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "workamajig",
  propDefinitions: {
    companyKey: {
      type: "string",
      label: "Company Key",
      description: "Identifier of a company",
      async options() {
        const { data: { company } } = await this.searchCompanies({
          params: {
            text: "",
          },
        });
        if (!company?.length) {
          return [];
        }
        return company.map(({
          companyKey: value, companyName: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    contactKey: {
      type: "string",
      label: "Contact Key",
      description: "Identifier of the contact to update",
      async options({ companyKey }) {
        const { data: { contact } } = await this.searchContacts({
          params: {
            companyKey,
          },
        });
        if (!contact?.length) {
          return [];
        }
        return contact.map(({
          contactKey: value, email: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.workamajig.com/api/beta1`;
    },
    _headers() {
      return {
        "APIAccessToken": `${this.$auth.api_access_token}`,
        "UserToken": `${this.$auth.user_token}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    getContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies/search",
        ...opts,
      });
    },
    searchContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/search",
        ...opts,
      });
    },
    searchActivities(opts = {}) {
      return this._makeRequest({
        path: "/activities/search",
        ...opts,
      });
    },
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities/list",
        ...opts,
      });
    },
    createActivity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/activities",
        ...opts,
      });
    },
    createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies",
        ...opts,
      });
    },
    updateContact(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/contacts",
        ...opts,
      });
    },
  },
};
