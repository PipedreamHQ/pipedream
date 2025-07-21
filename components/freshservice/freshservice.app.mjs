import { axios } from "@pipedream/platform";
import {
  DB_LAST_DATE_CHECK,
  PAGE_SIZE,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  TICKET_SORT_OPTIONS,
  ORDER_TYPE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "freshservice",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "ID of the company to which the ticket belongs",
      async options({ page }) {
        const { companies } = await this.getCompanies({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return companies?.map((company) => ({
          label: company.name,
          value: company.id,
        })) || [];
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "ID of the ticket",
      async options({ page }) {
        const { tickets } = await this.listTickets({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return tickets?.map((ticket) => ({
          label: ticket.subject,
          value: ticket.id,
        })) || [];
      },
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "ID of the agent",
      async options({ page }) {
        const { agents } = await this.getAgents({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return agents?.map((agent) => ({
          label: `${agent.contact.name} (${agent.contact.email})`,
          value: agent.id,
        })) || [];
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "ID of the group",
      async options({ page }) {
        const { groups } = await this.getGroups({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
          },
        });
        return groups?.map((group) => ({
          label: group.name,
          value: group.id,
        })) || [];
      },
    },
    ticketStatus: {
      type: "integer",
      label: "Status",
      description: "Status of the ticket",
      options: STATUS_OPTIONS,
    },
    ticketPriority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the ticket",
      options: PRIORITY_OPTIONS,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email of the contact",
      async options({
        page, companyId,
      }) {
        const contacts = await this.getContacts({
          params: {
            page: page + 1,
            per_page: PAGE_SIZE,
            company_id: companyId,
          },
        });
        return contacts?.map((contact) => ({
          label: contact.email,
          value: contact.email,
        })) || [];
      },
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Sort tickets by this field",
      options: TICKET_SORT_OPTIONS,
      default: "created_at",
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "Sort order",
      options: ORDER_TYPE_OPTIONS,
      default: "desc",
    },
  },
  methods: {
    _domain() {
      return this.$auth.domain;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return `https://${this._domain()}.freshservice.com/api`;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(),
        auth: {
          username: this._apiKey(),
          password: "X",
        },
        ...args,
      });
    },
    base64Encode(str) {
      return Buffer.from(str).toString("base64");
    },
    parseIfJSONString(value) {
      try {
        return typeof value === "string"
          ? JSON.parse(value)
          : value;
      } catch (error) {
        return value;
      }
    },
    async setLastDateChecked(value) {
      await this.db.set(DB_LAST_DATE_CHECK, value);
    },
    async getLastDateChecked() {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return await this.db.get(DB_LAST_DATE_CHECK) || thirtyDaysAgo.toISOString();
    },
    // Company methods
    async createCompany(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/companies",
        ...args,
      });
    },
    async getCompanies(args = {}) {
      return this._makeRequest({
        path: "/v2/companies",
        ...args,
      });
    },
    // Contact methods
    async createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/requesters",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/v2/requesters",
        ...args,
      });
    },
    async searchContacts(args = {}) {
      return this._makeRequest({
        path: "/v2/requesters/search",
        ...args,
      });
    },
    async filterContacts(args = {}) {
      return this._makeRequest({
        path: "/v2/requesters/filter",
        ...args,
      });
    },
    // Agent methods
    async getAgents(args = {}) {
      return this._makeRequest({
        path: "/v2/agents",
        ...args,
      });
    },
    // Group methods
    async getGroups(args = {}) {
      return this._makeRequest({
        path: "/v2/groups",
        ...args,
      });
    },
    // Ticket methods
    async createTicket(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/tickets",
        ...args,
      });
    },
    async getTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/v2/tickets/${ticketId}`,
        ...args,
      });
    },
    async listTickets(args = {}) {
      return this._makeRequest({
        path: "/v2/tickets",
        ...args,
      });
    },
    async updateTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/v2/tickets/${ticketId}`,
        ...args,
      });
    },
    async searchTickets(args = {}) {
      return this._makeRequest({
        path: "/v2/tickets/search",
        ...args,
      });
    },
    async filterTickets(args = {}) {
      return this._makeRequest({
        path: "/v2/tickets/filter",
        ...args,
      });
    },
    async getTicketName(ticketId) {
      const { ticket } = await this.getTicket({
        ticketId,
      });
      return ticket?.subject || ticketId;
    },
    // Note methods
    async createNote({
      ticketId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v2/tickets/${ticketId}/notes`,
        ...args,
      });
    },
  },
};
