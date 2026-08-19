// x-pd-ai: optimized
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wealthbox",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "The numeric ID of the contact. Use **Find Contact** to search by name, email, or phone, or **List Contact Options** to browse all contacts and retrieve their IDs. Example: `67890`.",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts?.map(({
          id, first_name: firstName, last_name: lastName, name,
        }) => ({
          label: [
            firstName,
            lastName,
          ].filter(Boolean).join(" ") || name || `Contact ${id}`,
          value: id,
        })) || [];
      },
    },
    contactType: {
      type: "string",
      label: "Type",
      description: "The user-defined contact type category for the contact being created (e.g. `Client`, `Prospect`, `Vendor`). Use **List Type Options** to discover valid values configured in your Wealthbox account.",
      async options() {
        const { contact_types: types } = await this.listCustomizableCategory({
          type: "contact_types",
        });
        return types.map(({ name }) =>  name );
      },
    },
    opportunityStage: {
      type: "string",
      label: "Stage",
      description: "The current stage of the opportunity (e.g. `Prospect`, `Proposal`, `Closed Won`). Use **List Stage Options** to discover valid stage IDs configured in your Wealthbox account.",
      async options() {
        const { opportunity_stages: stages } = await this.listCustomizableCategory({
          type: "opportunity_stages",
        });
        return stages.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    taskCategory: {
      type: "string",
      label: "Category",
      description: "The category the task belongs to (e.g. `Follow Up`, `Meeting`, `Review`). Use **List Category Options** to discover valid category IDs configured in your Wealthbox account.",
      async options() {
        const { task_categories: categories } = await this.listCustomizableCategory({
          type: "task_categories",
        });
        return categories.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.crmworkspace.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        path: "/events",
        ...args,
      });
    },
    listOpportunities(args = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    listCustomizableCategory({
      type, ...args
    } = {}) {
      return this._makeRequest({
        path: `/categories/${type}`,
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    createEvent(args = {}) {
      return this._makeRequest({
        path: "/events",
        method: "POST",
        ...args,
      });
    },
    createOpportunity(args = {}) {
      return this._makeRequest({
        path: "/opportunities",
        method: "POST",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        method: "POST",
        ...args,
      });
    },
    listNotes(args = {}) {
      return this._makeRequest({
        path: "/notes",
        ...args,
      });
    },
    listComments(args = {}) {
      return this._makeRequest({
        path: "/comments",
        ...args,
      });
    },
    listWorkflows(args = {}) {
      return this._makeRequest({
        path: "/workflows",
        ...args,
      });
    },
    listWorkflowTemplates(args = {}) {
      return this._makeRequest({
        path: "/workflow_templates",
        ...args,
      });
    },
    listActivityStream(args = {}) {
      return this._makeRequest({
        path: "/activity",
        ...args,
      });
    },
    createNote(args = {}) {
      return this._makeRequest({
        path: "/notes",
        method: "POST",
        ...args,
      });
    },
    addHouseholdMember({
      householdId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/households/${householdId}/members`,
        method: "POST",
        ...args,
      });
    },
    startWorkflow(args = {}) {
      return this._makeRequest({
        path: "/workflows",
        method: "POST",
        ...args,
      });
    },
  },
};
