import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bilflo",
  propDefinitions: {
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The name of the business for the new client account.",
    },
    contractJobIdentifier: {
      type: "string",
      label: "Contract Job Identifier",
      description: "The unique identifier for the contract job.",
    },
    invoiceGroupIdentifier: {
      type: "string",
      label: "Invoice Group Identifier",
      description: "The unique identifier for the invoice group.",
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The unique identifier for the client.",
    },
    contractorId: {
      type: "string",
      label: "Contractor ID",
      description: "The unique identifier for the contractor.",
    },
    contractorTypeId: {
      type: "string",
      label: "Contractor Type ID",
      description: "The unique identifier for the contractor type.",
    },
    timeCardMethodId: {
      type: "string",
      label: "Time Card Method ID",
      description: "The unique identifier for the time card method.",
    },
    overtimeRuleId: {
      type: "string",
      label: "Overtime Rule ID",
      description: "The unique identifier for the overtime rule.",
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The title of the job.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the contract job.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the contract job.",
    },
    firstWeekEndingDate: {
      type: "string",
      label: "First Week Ending Date",
      description: "The first week ending date of the contract job.",
    },
    burdenTypeId: {
      type: "string",
      label: "Burden Type ID",
      description: "The unique identifier for the burden type.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.bilflo.com/v0.0.${ts}";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "company-id": this.$auth.company_id,
          "api-key": this.$auth.api_key,
        },
      });
    },
    async createClient({ businessName }) {
      return this._makeRequest({
        method: "POST",
        path: "/Clients",
        data: {
          businessName,
        },
      });
    },
    async assignContractJobToInvoiceGroup({
      contractJobIdentifier, invoiceGroupIdentifier,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/Clients/contractInvoiceGroups/assignContractJob",
        data: {
          contractJobIdentifier,
          invoiceGroupIdentifier,
        },
      });
    },
    async createContractJob({
      clientId, contractorId, contractorTypeId, timeCardMethodId, overtimeRuleId, jobTitle, startDate, endDate, firstWeekEndingDate, burdenTypeId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/ContractJobs",
        data: {
          clientId,
          contractorId,
          contractorTypeId,
          timeCardMethodId,
          overtimeRuleId,
          jobTitle,
          startDate,
          endDate,
          firstWeekEndingDate,
          burdenTypeId,
        },
      });
    },
  },
};
