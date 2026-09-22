import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "connectwise_psa",
  propDefinitions: {
    company: {
      type: "integer",
      label: "Company",
      description: "The identifier of a company",
      async options({ page }) {
        const companies = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        return companies?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contact: {
      type: "integer",
      label: "Contact",
      description: "The identifier of a contact",
      async options({ page }) {
        const contacts = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts?.map(({
          id: value, firstName, lastName,
        }) => ({
          value,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    companyTypes: {
      type: "integer[]",
      label: "Types",
      description: "Select one or more company types",
      async options({ page }) {
        const types = await this.listCompanyTypes({
          params: {
            page: page + 1,
          },
        });
        return types?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contactTypes: {
      type: "integer[]",
      label: "Types",
      description: "Select one or more contact types",
      async options({ page }) {
        const types = await this.listContactTypes({
          params: {
            page: page + 1,
          },
        });
        return types?.map(({
          id: value, description: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    status: {
      type: "integer",
      label: "Status",
      description: "The status of the company",
      async options({ page }) {
        const statuses = await this.listCompanyStatuses({
          params: {
            page: page + 1,
          },
        });
        return statuses?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    territory: {
      type: "integer",
      label: "Territory",
      description: "The territory location the company",
      optional: true,
      async options({ page }) {
        const territories = await this.listLocations({
          params: {
            page: page + 1,
          },
        });
        return territories?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    market: {
      type: "integer",
      label: "Market",
      description: "The market of the company",
      optional: true,
      async options({ page }) {
        const markets = await this.listMarkets({
          params: {
            page: page + 1,
          },
        });
        return markets?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    relationship: {
      type: "integer",
      label: "Relationship",
      description: "The relationship of the contact",
      optional: true,
      async options({ page }) {
        const relationships = await this.listRelationships({
          params: {
            page: page + 1,
          },
        });
        return relationships?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    department: {
      type: "integer",
      label: "Department",
      description: "The department of the contact",
      optional: true,
      async options({ page }) {
        const departments = await this.listDepartments({
          params: {
            page: page + 1,
          },
        });
        return departments?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    country: {
      type: "integer",
      label: "Country",
      description: "The identifier of a country",
      optional: true,
      async options({ page }) {
        const countries = await this.listCountries({
          params: {
            page: page + 1,
          },
        });
        return countries?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "The priority of the ticket",
      optional: true,
      async options({ page }) {
        const priorities = await this.listPriorities({
          params: {
            page: page + 1,
          },
        });
        return priorities?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket to retrieve",
      async options({ page }) {
        const tickets = await this.listTickets({
          params: {
            page: page + 1,
          },
        });
        return tickets?.map(({
          id: value, summary: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}/v4_6_release/apis/3.0`;
    },
    _headers() {
      return {
        clientId: this.$auth.client_id,
      };
    },
    _auth() {
      return {
        username: `${this.$auth.company_id}+${this.$auth.public_key}`,
        password: `${this.$auth.private_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        auth: this._auth(),
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/company/companies",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/company/contacts",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/project/projects",
        ...opts,
      });
    },
    listTickets(opts = {}) {
      return this._makeRequest({
        path: "/service/tickets",
        ...opts,
      });
    },
    getTicket({
      ticketId, ...opts
    }) {
      return this._makeRequest({
        path: `/service/tickets/${ticketId}`,
        ...opts,
      });
    },
    listTimeEntries(opts = {}) {
      return this._makeRequest({
        path: "/time/entries",
        ...opts,
      });
    },
    listReports(opts = {}) {
      return this._makeRequest({
        path: "/system/reports",
        ...opts,
      });
    },
    listCompanyTypes(opts = {}) {
      return this._makeRequest({
        path: "/company/companies/types",
        ...opts,
      });
    },
    listContactTypes(opts = {}) {
      return this._makeRequest({
        path: "/company/contacts/types",
        ...opts,
      });
    },
    listCompanyStatuses(opts = {}) {
      return this._makeRequest({
        path: "/company/companies/statuses",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/system/locations",
        ...opts,
      });
    },
    listMarkets(opts = {}) {
      return this._makeRequest({
        path: "/company/marketDescriptions",
        ...opts,
      });
    },
    listRelationships(opts = {}) {
      return this._makeRequest({
        path: "/company/contacts/relationships",
        ...opts,
      });
    },
    listDepartments(opts = {}) {
      return this._makeRequest({
        path: "/company/contacts/departments",
        ...opts,
      });
    },
    listPriorities(opts = {}) {
      return this._makeRequest({
        path: "/service/priorities",
        ...opts,
      });
    },
    listCountries(opts = {}) {
      return this._makeRequest({
        path: "/company/countries",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/company/contacts",
        ...opts,
      });
    },
    createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/company/companies",
        ...opts,
      });
    },
    createTicket(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/service/tickets",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
      max,
      lastId,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let hasMore, count = 0;
      do {
        const items = await resourceFn({
          params,
        });
        for (const item of items) {
          if (max && count >= max) {
            return;
          }

          // orderby id desc
          if (item.id <= lastId) {
            return;
          }

          yield item;
          count++;
        }

        hasMore = items.length;
        params.page++;
      } while (hasMore);
    },
  },
};
