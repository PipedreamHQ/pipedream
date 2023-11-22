import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "saleslens",
  propDefinitions: {
    employeeExternalId: {
      type: "string",
      label: "Employee External ID",
      description: "The external ID of the employee",
      async options() {
        const employees = await this.listEmployees();
        return employees.map((employee) => ({
          label: `${employee.firstName} ${employee.lastName}`,
          value: employee.employeeExternalId,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      async options() {
        const categories = await this.getCategories();
        return categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
      },
    },
    transcription: {
      type: "string",
      label: "Transcription",
      description: "The transcription of the conversation",
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Locale of the transcription",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the transcription",
      optional: true,
    },
    fileExtension: {
      type: "string",
      label: "File Extension",
      description: "File extension of the recording",
      optional: true,
    },
    httpHeader: {
      type: "string",
      label: "HTTP Header",
      description: "HTTP header for the recording download URL",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "Tags associated with the transcription",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Contact's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Contact's phone number",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.saleslens.io/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async listEmployees() {
      return this._makeRequest({
        path: "/employees",
      });
    },
    async getCategories() {
      return this._makeRequest({
        path: "/categories",
      });
    },
    async uploadConversation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/access_token/call_record/upload",
        ...opts,
      });
    },
    async uploadTranscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/access_token/conversation_transcription/upload",
        ...opts,
      });
    },
  },
};
