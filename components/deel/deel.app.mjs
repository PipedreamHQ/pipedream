import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deel",
  propDefinitions: {
    contractId: {
      type: "string",
      label: "Contract ID",
      description: "The unique identifier of the Deel contract. Use **List Contracts** to find contract IDs.",
    },
    workerId: {
      type: "string",
      label: "Worker ID",
      description: "The unique identifier of the Deel worker (employee). Obtain from a contract's worker details.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 alpha-2 country code (e.g., `DE` for Germany, `GB` for United Kingdom, `US` for United States).",
    },
    clientTeamId: {
      type: "string",
      label: "Client Team ID",
      description: "The ID of the client team (department) for this contract. Retrieve from your Deel organization settings.",
    },
    clientLegalEntityId: {
      type: "string",
      label: "Client Legal Entity ID",
      description: "The ID of the client legal entity (company) for this contract. Retrieve from your Deel organization settings.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.letsdeel.com/rest/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
      headers = {},
      ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        data,
        params,
        ...opts,
      });
    },
    async getContract($, contractId) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}`,
      });
    },
    async getContractPreview($, contractId) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/preview`,
      });
    },
    async listContracts($, params) {
      return this._makeRequest({
        $,
        path: "/contracts",
        params,
      });
    },
    async createIcContract($, data) {
      return this._makeRequest({
        $,
        path: "/contracts",
        method: "POST",
        data: {
          data,
        },
      });
    },
    async sendContractInvitation($, contractId, data) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/invitations`,
        method: "POST",
        data: {
          data,
        },
      });
    },
    async signContract($, contractId, data) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/signatures`,
        method: "POST",
        data: {
          data,
        },
      });
    },
    async amendContract($, contractId, data) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/amendments`,
        method: "POST",
        data: {
          data,
        },
      });
    },
    async createContractTask($, contractId, data) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/tasks`,
        method: "POST",
        data: {
          data,
        },
      });
    },
    async listContractTasks($, contractId) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/tasks`,
      });
    },
    async reviewContractTask($, contractId, taskId, data) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/tasks/${taskId}/reviews`,
        method: "POST",
        data: {
          data,
        },
      });
    },
    async listContractAdjustments($, contractId, params) {
      return this._makeRequest({
        $,
        path: `/contracts/${contractId}/adjustments`,
        params,
      });
    },
    async createInvoiceAdjustment($, data) {
      return this._makeRequest({
        $,
        path: "/invoice-adjustments",
        method: "POST",
        data: {
          data,
        },
      });
    },
    async listTimesheets($, params) {
      return this._makeRequest({
        $,
        path: "/timesheets",
        params,
      });
    },
    async getEorHiringGuide($, countryCode) {
      return this._makeRequest({
        $,
        path: `/eor/validations/${countryCode}`,
      });
    },
    async getEorContractForm($, countryCode) {
      return this._makeRequest({
        $,
        path: `/forms/eor/create-contract/${countryCode}`,
      });
    },
    async getEorBenefits($, params) {
      return this._makeRequest({
        $,
        path: "/eor/benefits",
        params,
      });
    },
    async createEorContract($, data) {
      return this._makeRequest({
        $,
        path: "/eor",
        method: "POST",
        data: {
          data,
        },
      });
    },
    async listEorPayslips($, workerId) {
      return this._makeRequest({
        $,
        path: `/eor/workers/${workerId}/payslips`,
      });
    },
    async createGpContract($, data) {
      return this._makeRequest({
        $,
        path: "/contracts/gp",
        method: "POST",
        data: {
          data,
        },
      });
    },
    async listGpPayslips($, workerId) {
      return this._makeRequest({
        $,
        path: `/gp/workers/${workerId}/payslips`,
      });
    },
    async createAdjustment($, form) {
      return this._makeRequest({
        $,
        path: "/adjustments",
        method: "POST",
        data: form,
        headers: form.getHeaders(),
      });
    },
    async createShiftRate($, data) {
      return this._makeRequest({
        $,
        path: "/time_tracking/shift_rates",
        method: "POST",
        data: {
          data,
        },
      });
    },
    async createShifts($, data) {
      return this._makeRequest({
        $,
        path: "/time_tracking/shifts",
        method: "POST",
        data: {
          data,
        },
      });
    },
  },
};
