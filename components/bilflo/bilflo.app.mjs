import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bilflo",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The unique identifier for the client.",
      async options() {
        const { data } = await this.listClients();

        return data.map(({
          clientId: value, businessName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bilflo.com/v1";
    },
    _headers() {
      return {
        "company-id": this.$auth.company_id,
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    createClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Clients",
        ...opts,
      });
    },
    listClients() {
      return this._makeRequest({
        path: "/Clients",
      });
    },
    assignContractJobToInvoiceGroup(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Clients/contractInvoiceGroups/assignContractJob",
        ...opts,
      });
    },
    createContractJob(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ContractJobs",
        ...opts,
      });
    },
  },
};
