import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wealthbox",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ page }) {
        const { contacts } = await this.listContacts({
          params: {
            page,
          },
        });
        return contacts?.map(({
          id, first_name: firstName, last_name: lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value: id,
        })) || [];
      },
    },
    contactType: {
      type: "string",
      label: "Type",
      description: "The type of the contact being created",
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
      description: "The current stage of the opportunity",
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
      description: "The category the task belongs to",
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
  },
};
