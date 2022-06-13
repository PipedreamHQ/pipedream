import constants from "./common/constants.mjs";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import retry from "async-retry";

export default {
  type: "app",
  app: "freshdesk",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "The ID of the company",
      async options() {
        const response = await this.getCompanies();
        return response.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    ticketStatus: {
      type: "integer",
      label: "Status",
      description: "Status of the ticket.",
      options() {
        return constants.TICKET_STATUS;
      },
    },
    ticketPriority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the ticket.",
      options() {
        return constants.TICKET_PRIORITY;
      },
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "Contact Email.",
      async options({ companyId }) {
        const response = await this.getCompanies();
        const contacts = response.filter((contact) => contact.company_id === Number(companyId));
        return contacts.map((contact) => ({
          label: contact?.email ?? contact?.name,
          value: contact.email,
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
    _getUrl(path) {
      const {
        HTTP_PROTOCOL,
        BASE_PATH,
        VERSION_PATH,
      } = constants;
      return `${HTTP_PROTOCOL}${this.$auth.domain}${BASE_PATH}${VERSION_PATH}${path}`;
    },
    async _makeRequest(args = {}) {
      const {
        $,
        method = "get",
        path,
        params,
        data,
      } = args;
      const config = {
        method,
        url: this._getUrl(path),
        headers: this._getHeaders(),
        params,
        data,
      };

      return axios($ ?? this, config);
    },
    _isRetriableStatusCode(statusCode) {
      constants.retriableStatusCodes.includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          const data = await apiCall();

          return data;
        } catch (err) {

          const { status = 500 } = err;
          if (!this._isRetriableStatusCode(status)) {
            bail(`
              Unexpected error (status code: ${status}):
              ${JSON.stringify(err.response)}
            `);
          }
          throw new ConfigurationError("Could not get data");
        }
      }, retryOpts);
    },
    async *filterTickets(params) {
      let loadedData = 0;
      do {
        const response = await this.searchTickets(params);

        if (!response || response.results.length === 0) {
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
        const response = await this.searchContacts(params);

        if (!response || response.results.length === 0) {
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
    async createCompany({
      $, payload: data,
    }) {
      return this._makeRequest({
        $,
        path: "/companies",
        data,
        method: "post",
      });
    },
    async getCompanies($ = undefined) {
      return this._makeRequest({
        $,
        path: "/contacts",
      });
    },
    async getContacts($ = undefined) {
      return this._makeRequest({
        $,
        path: "/companies",
      });
    },
    async createContact({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "/contacts",
        data,
        method: "post",
      });
    },
    async createTicket({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "/tickets",
        data,
        method: "post",
      });
    },
    async getTicket({
      $, id,
    }) {
      return this._makeRequest({
        $,
        path: `/tickets/${id}`,
      });
    },
    async searchTickets(params, $ = undefined) {
      return this._makeRequest({
        $,
        path: "/search/tickets",
        params,
      });
    },
    async searchContacts(params, $ = undefined) {
      return this._makeRequest({
        $,
        path: "/search/contacts",
        params,
      });
    },
  },
};
