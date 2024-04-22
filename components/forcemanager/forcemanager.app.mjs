import { axios } from "@pipedreamhq/platform";

export default {
  type: "app",
  app: "forcemanager",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Unique identifier for a contact",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the business opportunity or contact",
    },
    account: {
      type: "string",
      label: "Account",
      description: "Account associated with the business opportunity",
    },
    estimatedCloseDate: {
      type: "string",
      label: "Estimated Close Date",
      description: "Estimated date for the closure of the business opportunity",
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Stage of the business opportunity",
      optional: true,
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Probability of success for the business opportunity",
      optional: true,
    },
    revenue: {
      type: "integer",
      label: "Revenue",
      description: "Estimated revenue from the business opportunity",
      optional: true,
    },
    searchField: {
      type: "string",
      label: "Search Field",
      description: "The field to search for an existing contact",
      async options() {
        return [
          "name",
          "email",
          "phone_number",
        ];
      },
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "The value to search for in the selected field",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.forcemanager.net";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createActivity() {
      this.$emit({
        event: "New Activity Created",
      });
    },
    async createContact(contactId) {
      this.$emit({
        event: "New Contact Created",
        contactId,
      });
    },
    async createOpportunity(customerDetails, opportunityAttributes) {
      this.$emit({
        event: "New Opportunity Created",
        customerDetails,
        opportunityAttributes,
      });
    },
    async createBusinessOpportunity(name, account, estimatedCloseDate, stage, probability, revenue) {
      const data = {
        name,
        account,
        estimatedCloseDate,
        stage,
        probability,
        revenue,
      };
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        data,
      });
    },
    async searchContact(field, value) {
      return this._makeRequest({
        path: `/contacts/search?${field}=${value}`,
      });
    },
    async listUsers() {
      return this._makeRequest({
        path: "/users",
      });
    },
  },
};
