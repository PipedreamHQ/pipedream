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
    deal: {
      type: "string",
      label: "Deal",
      description: "Identifier of a deal",
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const deals = await this.listDeals({
          params,
        });
        if (!deals || deals?.length === 0) {
          return [];
        }
        const options = deals.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
        return {
          options,
          context: {
            cursor: deals[deals.length - 1]?.cursor,
          },
        };
      },
    },
    dealNote: {
      type: "string",
      label: "Note",
      description: "Identifier of a deal note",
      async options({
        dealId, prevContext,
      }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const notes = await this.listDealNotes({
          dealId,
          params,
        });
        if (!notes || notes?.length === 0) {
          return [];
        }
        const options = notes.map(({
          id, subject,
        }) => ({
          label: subject,
          value: id,
        }));
        return {
          options,
          context: {
            cursor: notes[notes.length - 1]?.cursor,
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
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const companies = await this.listCompanies({
          params,
        });
        if (!companies || companies?.length === 0) {
          return [];
        }
        const options = companies.map((company) => {
          const name = (company.properties.find((prop) => prop.name === "name"))?.value || company.id;
          return {
            label: name,
            value: company.id,
          };
        });
        return {
          options,
          context: {
            cursor: companies[companies.length - 1]?.cursor,
          },
        };
      },
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
    milestone: {
      type: "string",
      label: "Milestone",
      description: "Milestone of the deal",
      options: constants.MILESTONE_OPTIONS,
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
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Please provide a JSON structure like this per row: `{\"name\": \"Field Name\", \"value\": \"Field Value\"}`",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags to add to the specified contact",
    },
    score: {
      type: "integer",
      label: "Score",
      description: "Amount to add to contact score. If you want to decrease the existing score, then use negative values for the score parameter.",
    },
    noteSubject: {
      type: "string",
      label: "Subject",
      description: "The subject of the note",
    },
    noteDescription: {
      type: "string",
      label: "Description",
      description: "The description of the note",
      optional: true,
    },
    dealName: {
      type: "string",
      label: "Name",
      description: "Name of the deaL",
    },
    expectedValue: {
      type: "string",
      label: "Expected Value",
      description: "Expected value of the deal",
    },
    probability: {
      type: "string",
      label: "Probability",
      description: "Probability of the deal",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the company",
    },
    companyUrl: {
      type: "string",
      label: "URL",
      description: "URL of the company",
      optional: true,
    },
  },
  methods: {
    _username() {
      return this.$auth.username;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return `https://${this.$auth.domain}.agilecrm.com/dev/api/`;
    },
    _getAuth() {
      return {
        username: this._username(),
        password: this._apiKey(),
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
    getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `contacts/${contactId}`,
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "tasks",
        ...args,
      });
    },
    listTickets(args = {}) {
      return this._makeRequest({
        path: "tickets/filter",
        ...args,
      });
    },
    listFilters(args = {}) {
      return this._makeRequest({
        path: "tickets/filters",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "opportunity",
        ...args,
      });
    },
    listDealNotes({
      dealId, ...args
    }) {
      return this._makeRequest({
        path: `opportunity/${dealId}/notes`,
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "contacts/companies/list",
        method: "POST",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tasks",
        ...args,
      });
    },
    createTicket(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tickets/new-ticket",
        ...args,
      });
    },
    updateContact(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "contacts/edit-properties",
        ...args,
      });
    },
    addTagToContact(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "contacts/edit/tags",
        ...args,
      });
    },
    addScoreToContact(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "contacts/edit/lead-score",
        ...args,
      });
    },
    createContactNote(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "notes",
        ...args,
      });
    },
    createDeal(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "opportunity",
        ...args,
      });
    },
    createDealNote(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "opportunity/deals/notes",
        ...args,
      });
    },
    updateDeal(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "opportunity/partial-update",
        ...args,
      });
    },
    updateDealNote(args = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "opportunity/deals/notes",
        ...args,
      });
    },
  },
};
