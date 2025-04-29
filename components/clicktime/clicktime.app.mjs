import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "clicktime",
  propDefinitions: {
    accountingPackageId: {
      type: "string",
      label: "Accounting Package ID",
      description: "Unique identifier for the accounting package",
    },
    billingRate: {
      type: "string",
      label: "Billing Rate",
      description: "The billing rate for the user, job or client",
    },
    clientNumber: {
      type: "string",
      label: "Client Number",
      description: "A unique identifier for the client in the system",
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the user, job or client is currently active",
    },
    isEligibleTimeOffAllocation: {
      type: "boolean",
      label: "Eligible for Time Off Allocation",
      description: "Determines if the entity is eligible for time-off allocation",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the user, job or client",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional information related to the user, job or client",
    },
    shortName: {
      type: "string",
      label: "Short Name",
      description: "A shorter version of the name for easier reference",
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "Unique identifier of the client associated with a job",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const response = await this.getClients({
          params: {
            limit,
            offset: page * limit,
          },
        });
        const clientIds = response.data;
        return clientIds.map(({
          ID, Name,
        }) => ({
          label: Name,
          value: ID,
        }));
      },
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the job, i.e.: `2020-01-01`",
    },
    includeInRm: {
      type: "boolean",
      label: "Include in RM",
      description: "Specifies whether the job should be included in RM",
    },
    isBillable: {
      type: "boolean",
      label: "Is Billable",
      description: "Indicates whether the job is billable",
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "Unique identifier assigned to a job for tracking purposes",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date of the user or job, i.e.: `2020-01-01`",
    },
    timeRequiresApproval: {
      type: "boolean",
      label: "Time Requires Approval",
      description: "Indicates whether time entries for the job require approval",
    },
    useCompanyBillingRate: {
      type: "boolean",
      label: "Use Company Billing Rate",
      description: "Specifies whether the job uses the company-wide billing rate instead of a custom one",
    },
    costModel: {
      type: "string",
      label: "Cost Model",
      description: "Defines the cost model used for the user",
      options: constants.COST_MODELS,
    },
    costRate: {
      type: "string",
      label: "Cost Rate",
      description: "The internal cost rate associated with the user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address associated with the user",
    },
    employmentTypeId: {
      type: "string",
      label: "Employment Type ID",
      description: "Unique identifier for the user's employment type",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const response = await this.getEmploymentTypes({
          params: {
            limit,
            offset: page * limit,
          },
        });
        const employmentTypeIds = response.data;
        return employmentTypeIds.map(({
          ID, Name,
        }) => ({
          label: Name,
          value: ID,
        }));
      },
    },
    role: {
      type: "string",
      label: "Role",
      description: "The role assigned to the user",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.clicktime.com/v2";
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
          "Authorization": `Token ${this.$auth.api_token}`,
          ...headers,
        },
      });
    },
    async createClient(args = {}) {
      return this._makeRequest({
        path: "/Clients",
        method: "post",
        ...args,
      });
    },
    async createJob(args = {}) {
      return this._makeRequest({
        path: "/Jobs",
        method: "post",
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        path: "/Manage/Users",
        method: "post",
        ...args,
      });
    },
    async getClients(args = {}) {
      return this._makeRequest({
        path: "/Clients",
        ...args,
      });
    },
    async getEmploymentTypes(args = {}) {
      return this._makeRequest({
        path: "/EmploymentTypes",
        ...args,
      });
    },
  },
};
