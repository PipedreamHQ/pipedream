import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "beebole_app",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "The ID of the company",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company",
    },
    companyCorporate: {
      type: "boolean",
      label: "Is Corporate",
      description: "Is the company corporate or not?",
      optional: true,
      default: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://beebole-apps.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "",
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        data,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    async createCompany({ companyName, companyCorporate }) {
      return this._makeRequest({
        data: {
          service: "company.create",
          company: {
            name: companyName,
            corporate: companyCorporate,
          },
        },
      });
    },
    async listCompanies() {
      return this._makeRequest({
        data: {
          service: "company.list",
        },
      });
    },
    async updateCompany({ companyId, companyName }) {
      return this._makeRequest({
        data: {
          service: "company.update",
          company: {
            id: companyId,
            name: companyName,
          },
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: `0.0.${new Date().getTime()}`,
};