import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "espo_crm",
  propDefinitions: {
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "Specify the entity type to be tracked",
    },
    field: {
      type: "string",
      label: "Field",
      description: "Specify the field to be tracked",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Specify the contact's name",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Specify the contact's email",
    },
    contactPhone: {
      type: "string",
      label: "Contact Phone",
      description: "Specify the contact's phone number",
    },
    contactAddress: {
      type: "string",
      label: "Contact Address",
      description: "Specify the contact's address",
      optional: true,
    },
    contactJobTitle: {
      type: "string",
      label: "Contact Job Title",
      description: "Specify the contact's job title",
      optional: true,
    },
    contactCompany: {
      type: "string",
      label: "Contact Company",
      description: "Specify the contact's company",
      optional: true,
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "Specify the task name",
    },
    taskDueDate: {
      type: "string",
      label: "Task Due Date",
      description: "Specify the task due date",
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "Specify the task description",
      optional: true,
    },
    taskAssignedUser: {
      type: "string",
      label: "Task Assigned User",
      description: "Specify the user assigned to the task",
      optional: true,
    },
    taskPriority: {
      type: "string",
      label: "Task Priority",
      description: "Specify the task priority",
      optional: true,
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Specify the account name to filter the results",
      optional: true,
    },
    accountIndustry: {
      type: "string",
      label: "Account Industry",
      description: "Specify the account industry to filter the results",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.espo-crm.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Contact",
        ...opts,
      });
    },
    async createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Task",
        ...opts,
      });
    },
    async getAccounts(opts = {}) {
      return this._makeRequest({
        path: "/Account",
        ...opts,
      });
    },
    async trackEntityChanges() {
      // Implement the method to track changes in the entity
    },
  },
};
