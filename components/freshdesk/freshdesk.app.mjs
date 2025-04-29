import constants from "./common/constants.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshdesk",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "Select a company or provide a company ID",
      async options() {
        const response = await this.getCompanies();
        return response.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    ticketId: {
      type: "integer",
      label: "Ticket ID",
      description: "Select a ticket or provide a ticket ID",
      async options({ page = 0 }) {
        const response = await this.listTickets({
          params: {
            page: page + 1,
          },
        });
        return response.map(({
          id, subject,
        }) => ({
          label: subject || id,
          value: id,
        }));
      },
    },
    ticketStatus: {
      type: "integer",
      label: "Status",
      description: "Status of the ticket",
      options() {
        return constants.TICKET_STATUS;
      },
    },
    ticketPriority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the ticket",
      options() {
        return constants.TICKET_PRIORITY;
      },
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "Select a contact or provide a contact's email",
      async options({ companyId }) {
        const contacts = await this.getContacts({
          params: {
            company_id: companyId,
          },
        });
        return contacts
          .filter(({ email }) => email)
          .map(({
            email, name,
          }) => ({
            label: name || email,
            value: email,
          }));
      },
    },
  },
  methods: {
    setLastDateChecked(db, value) {
      db && db.set(constants.DB_LAST_DATE_CHECK, value);
    },
    getLastDateChecked(db) {
      return db && db.get(constants.DB_LAST_DATE_CHECK);
    },
    base64Encode(data) {
      return Buffer.from(data).toString("base64");
    },
    _getHeaders() {
      return {
        "Authorization": "Basic " + this.base64Encode(this.$auth.api_key + ":X"),
        "Content-Type": "application/json;charset=utf-8",
      };
    },
    _getDomain() {
      const { domain } = this.$auth;
      return domain.includes("freshdesk.com")
        ? domain
        : `${domain}.freshdesk.com`;
    },
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: `https://${this._getDomain()}/api/v2`,
        headers: {
          ...this._getHeaders(),
          ...headers,
        },
        ...args,
      });
    },
    async *filterTickets(params) {
      let loadedData = 0;
      do {
        const response = await this.searchTickets({
          params,
        });

        if (!response?.results?.length) {
          return;
        }
        loadedData += response.results.length;
        for (const ticket of response.results) {
          yield ticket;
        }
        if (loadedData >= response.total) {
          return;
        }
        params.page += 1;
      } while (true);
    },
    async *filterContacts(params) {
      let loadedData = 0;
      do {
        const response = await this.searchContacts({
          params,
        });

        if (!response?.results?.length) {
          return;
        }
        loadedData += response.results.length;
        for (const ticket of response.results) {
          yield ticket;
        }
        if (loadedData >= response.total) {
          return;
        }
        params.page += 1;
      } while (true);
    },
    async createCompany(args) {
      return this._makeRequest({
        url: "/companies",
        method: "post",
        ...args,
      });
    },
    async getCompanies(args) {
      return this._makeRequest({
        url: "/companies",
        ...args,
      });
    },
    async getContacts(args) {
      return this._makeRequest({
        url: "/contacts",
        ...args,
      });
    },
    async createContact(args) {
      return this._makeRequest({
        url: "/contacts",
        method: "post",
        ...args,
      });
    },
    async createTicket(args) {
      return this._makeRequest({
        url: "/tickets",
        method: "post",
        ...args,
      });
    },
    async getTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        url: `/tickets/${ticketId}`,
        ...args,
      });
    },
    async searchTickets(args) {
      return this._makeRequest({
        url: "/search/tickets",
        ...args,
      });
    },
    async searchContacts(args) {
      return this._makeRequest({
        url: "/search/contacts",
        ...args,
      });
    },
    async listTickets(args) {
      return this._makeRequest({
        url: "/tickets",
        ...args,
      });
    },
  },
};
