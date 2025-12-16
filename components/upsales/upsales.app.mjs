import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upsales",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user or provide a user ID",
      async options() {
        const data = await this.listUsers();
        return data.map((user) => ({
          label: `${user.name} (${user.email})`,
          value: user.clientid,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "Select a stage or provide a stage ID",
      async options() {
        const data = await this.listStages();
        return data.map((stage) => ({
          label: `${stage.name} (${stage.probability}%)`,
          value: stage.id,
        }));
      },
    },
    stageName: {
      type: "string",
      label: "Name",
      description: "The name of the stage",
    },
    stageProbability: {
      type: "integer",
      label: "Probability",
      description: "The probability percentage (0-100) associated with this stage",
      min: 0,
      max: 100,
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Select a company or provide a company ID",
      async options() {
        const data = await this.listCompanies();
        return data.map((company) => ({
          label: company.name,
          value: company.id,
        }));
      },
    },
    companyName: {
      type: "string",
      label: "Name",
      description: "The name of the company",
    },
    companyPhone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the company",
      optional: true,
    },
    companyWebpage: {
      type: "string",
      label: "Webpage",
      description: "The webpage URL of the company",
      optional: true,
    },
    companyCustom: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom field/value pairs in JSON format. Each entry should be a string like `{ \"value\": \"2210\", \"fieldId\": 3 }`",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Select a contact or provide a contact ID",
      async options() {
        const data = await this.listContacts();
        return data.map((contact) => ({
          label: `${contact.name || `${contact.firstName} ${contact.lastName}`} (${contact.email || "No email"})`,
          value: contact.id,
        }));
      },
    },
    contactFirstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
      optional: true,
    },
    contactLastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
      optional: true,
    },
    contactPhone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact",
      optional: true,
    },
    contactCellPhone: {
      type: "string",
      label: "Cell Phone",
      description: "The cell phone number of the contact",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
      optional: true,
    },
    contactTitle: {
      type: "string",
      label: "Title",
      description: "The job title of the contact",
      optional: true,
    },
    contactActive: {
      type: "boolean",
      label: "Active",
      description: "Whether the contact is active",
      optional: true,
    },
    contactClientId: {
      type: "integer",
      label: "Client ID",
      description: "The client ID to associate with this contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://integration.upsales.com/api/v2";
    },
    async _makeRequest({
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          token: this.$auth.api_key,
        },
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/master/users",
        ...args,
      });
    },
    async listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
    async getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async deactivateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async listStages(args = {}) {
      return this._makeRequest({
        url: "/orderstages",
        ...args,
      });
    },
    async getStage({
      stageId, ...args
    }) {
      return this._makeRequest({
        url: `/orderstages/${stageId}`,
        ...args,
      });
    },
    async createStage(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/orderstages",
        ...args,
      });
    },
    async updateStage({
      stageId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/orderstages/${stageId}`,
        ...args,
      });
    },
    async listCompanies(args = {}) {
      return this._makeRequest({
        url: "/accounts",
        ...args,
      });
    },
    async getCompany({
      companyId, ...args
    }) {
      return this._makeRequest({
        url: `/accounts/${companyId}`,
        ...args,
      });
    },
    async createCompany(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/accounts",
        ...args,
      });
    },
    async updateCompany({
      companyId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/accounts/${companyId}`,
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        url: "/contacts",
        ...args,
      });
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/contacts",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
  },
};
