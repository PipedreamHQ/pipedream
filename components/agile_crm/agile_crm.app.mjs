import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agile_crm",
  propDefinitions: {
    filter: {
      type: "string",
      label: "Filter",
      description: "Type of ticket filter",
      async options() {
        const filters = await this.listFilters();
        if (!filters || filters?.length === 0) {
          return [];
        }
        return filters.map((filter) => ({
          label: filter.name,
          value: filter.id,
        }));
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "The contact to update",
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const contacts = await this.listContacts({
          params,
        });
        if (!contacts || contacts?.length === 0) {
          return [];
        }
        const options = contacts.map((contact) => {
          const firstName = (contact.properties.find((prop) => prop.name === "first_name"))?.value || contact.id;
          const lastName = (contact.properties.find((prop) => prop.name === "last_name"))?.value || "";
          return {
            label: `${firstName} ${lastName}`,
            value: contact.id,
          };
        });
        return {
          options,
          context: {
            cursor: contacts[contacts.length - 1]?.cursor,
          },
        };
      },
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 100,
      label: "Max API Requests per Execution",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results).",
      optional: true,
      default: 1,
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
    company: {
      type: "string",
      label: "Company",
      description: "The contact's company",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.domain}.agilecrm.com/dev/api/`;
    },
    _getAuth() {
      return {
        username: this.$auth.username,
        password: this.$auth.api_key,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async listTasks(args = {}) {
      return this._makeRequest({
        path: "tasks",
        ...args,
      });
    },
    async listTickets(args = {}) {
      return this._makeRequest({
        path: "tickets/filter",
        ...args,
      });
    },
    async listFilters(args = {}) {
      return this._makeRequest({
        path: "tickets/filters",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    async updateContact(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "contacts/edit-properties",
        ...args,
      });
    },
  },
};
