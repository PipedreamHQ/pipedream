import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
    contactEmail: {
      type: "string",
      label: "Email",
      description: "Email address for ticket. If selected contact has no email on record, Enter a custom expression to overwrite",
      async options({ contactId }) {
        const contact = await this.getContact({
          contactId,
        });
        if (!contact) {
          return [];
        }
        const emails = contact.properties.filter((prop) => prop.name === "email").map((prop) => prop.value);
        return emails;
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
    group: {
      type: "string",
      label: "Group ID",
      description: "ID of the group to assign to the new ticket",
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
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the task",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of task",
      options: constants.TASK_TYPE_OPTIONS,
    },
    taskPriority: {
      type: "string",
      label: "Priority",
      description: "Priority of the task",
      options: constants.TASK_PRIORITY_OPTIONS,
      optional: true,
    },
    ticketPriority: {
      type: "string",
      label: "Priority",
      description: "Priority of the ticket",
      options: constants.TICKET_PRIORITY_OPTIONS,
      optional: true,
    },
    taskStatus: {
      type: "string",
      label: "Status",
      description: "Status of the task",
      options: constants.TASK_STATUS_OPTIONS,
      optional: true,
    },
    ticketStatus: {
      type: "string",
      label: "Status",
      description: "Status of the ticket",
      options: constants.TICKET_STATUS_OPTIONS,
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the task",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message for the new ticket",
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
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `contacts/${contactId}`,
        ...args,
      });
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
    async createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tasks",
        ...args,
      });
    },
    async createTicket(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tickets/new-ticket",
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
