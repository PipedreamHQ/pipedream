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
        const employees = await this.getEmployees();
        return employees.map((e) => ({
          value: e.id,
          label: `${e.firstName} ${e.lastName}`,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category",
      async options() {
        const categories = await this.getCategories();
        return categories.map((e) => ({
          value: e.id,
          label: e.title,
        }));
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale of the conversation",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the conversation",
      optional: true,
    },
    fileExtension: {
      type: "string",
      label: "File Extension",
      description: "The file extension of the conversation recording",
      optional: true,
    },
    httpHeader: {
      type: "string",
      label: "HTTP Header",
      description: "The HTTP header for the conversation recording download URL",
      optional: true,
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "The tags for the conversation",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's Email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
      optional: true,
    },
    transcription: {
      type: "string",
      label: "Transcription",
      description: "The transcription of the conversation",
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
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: this.$auth.api_token,
        },
      });
    },
    async getEmployees() {
      return this._makeRequest({
        path: "/access_token/employees",
      });
    },
    async getCategories() {
      return this._makeRequest({
        path: "/access_token/categories",
      });
    },
    async uploadConversation(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/access_token/call_record/upload",
      });
    },
    async uploadTranscription(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/access_token/call_transcription/upload",
      });
    },
  },
};