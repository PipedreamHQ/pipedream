import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "beebole_app",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      async options() {
        const response = await this.manageCompanies({
          data: {
            service: "company.list",
          },
        });
        const companiesIDs = response.companies;
        return companiesIDs.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company",
    },
  },
  methods: {
    _baseUrl() {
      return "https://beebole-apps.com/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        data,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        data,
        auth: {
          ...auth,
          username: `${this.$auth.api_token}`,
        },
      });
    },
    async manageCompanies(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
