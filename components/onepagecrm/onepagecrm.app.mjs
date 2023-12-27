import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "onepagecrm",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "ID of the company, to which the contact belongs.",
      async options({ page }) {
        const { data: { companies } } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        return companies.map(({ company }) => ({
          label: company.name,
          value: company.id,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact",
      async options({ page }) {
        const { data: { contacts } } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });
        return contacts.map(({
          contact: {
            id, first_name: fName, last_name: lName,
          },
        }) => ({
          label: `${fName} ${lName}`,
          value: id,
        }));
      },
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "The unique identifier for the deal,",
      async options({ page }) {
        const { data: { deals } } = await this.listDeals({
          params: {
            page: page + 1,
          },
        });

        return deals.map(({
          deal: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    leadSourceId: {
      type: "string",
      label: "Lead Source ID",
      description: "ID of the lead source.",
      async options({ page }) {
        const { data } = await this.listLeadSources({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, text: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "ID of a pipeline the deal belongs to.",
      async options() {
        const { data: { pipelines } } = await this.listPipelines();

        return pipelines.map(({
          pipeline: {
            id: value, name: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user, to whom the contact belongs.",
      async options({ page }) {
        const { data } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          user: {
            id: value, first_name: fName, last_name: lName,
          },
        }) => ({
          label: `${fName} ${lName}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.onepagecrm.com/api/v3";
    },
    _auth() {
      return {
        username: `${this.$auth.user_id}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    getDeal({
      dealId, ...opts
    }) {
      return this._makeRequest({
        path: `/deals/${dealId}.json`,
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies.json",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts.json",
        ...opts,
      });
    },
    listDeals(opts = {}) {
      return this._makeRequest({
        path: "/deals.json",
        ...opts,
      });
    },
    listLeadSources(opts = {}) {
      return this._makeRequest({
        path: "/lead_sources.json",
        ...opts,
      });
    },
    listPipelines(opts = {}) {
      return this._makeRequest({
        path: "/pipelines.json",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users.json",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts.json",
        ...opts,
      });
    },
    deleteContact(contactId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}.json`,
      });
    },
    updateDeal({
      dealId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/deals/${dealId}.json`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, field, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 1;

      do {
        params.per_page = LIMIT;
        params.page = page;
        page++;
        const { data } = await fn({
          params,
          ...opts,
        });

        const {
          page: currentPage,
          max_page: maxPage,
        } = data;

        for (const d of data[field]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(currentPage == maxPage);

      } while (hasMore);
    },
  },
};
