import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nutshell",
  propDefinitions: {
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry the company belongs to.",
      optional: true,
    },
    numberOfEmployees: {
      type: "integer",
      label: "Number of Employees",
      description: "The number of employees working in the company.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the company.",
      optional: true,
    },
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "The name of the lead.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the lead.",
    },
    forecastedCloseDate: {
      type: "string",
      label: "Forecasted Close Date",
      description: "The forecasted close date of the lead.",
      optional: true,
    },
    value: {
      type: "integer",
      label: "Value",
      description: "The value of the lead.",
      optional: true,
    },
    followUpDate: {
      type: "string",
      label: "Follow-Up Date",
      description: "The follow-up date for the lead.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person.",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the person.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.nutshell.com/v1";
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
          Authorization: `Basic ${this.$auth.api_key}`,
        },
      });
    },
    async createCompany({
      companyName, industry, numberOfEmployees, location,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/createCompany",
        data: {
          name: companyName,
          industry,
          numberOfEmployees,
          location,
        },
      });
    },
    async initiateLead({
      leadName, source, forecastedCloseDate, value, followUpDate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/initiateLead",
        data: {
          name: leadName,
          source,
          forecastedCloseDate,
          value,
          followUpDate,
        },
      });
    },
    async findOrCreatePerson({
      email, firstName, lastName, jobTitle,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api/findOrCreatePerson",
        data: {
          email,
          firstName,
          lastName,
          jobTitle,
        },
      });
    },
    async emitEventOnLeadCreation() {
      // Placeholder method for emitting an event when a new lead is created
    },
    async emitEventOnPersonProfileCreation() {
      // Placeholder method for emitting an event when a new person profile is created
    },
    async emitEventOnLeadWon() {
      // Placeholder method for emitting an event when a lead is won
    },
  },
};
