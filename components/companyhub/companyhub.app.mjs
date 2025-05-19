import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "companyhub",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      optional: true,
      async options({ page }) {
        const { Data: companies } = await this.listCompanies({
          params: {
            start: page,
          },
        });
        return companies?.map(({
          ID: value, Name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      optional: true,
      async options({ page }) {
        const { Data: contacts } = await this.listContacts({
          params: {
            start: page,
          },
        });
        return contacts?.map(({
          ID: value, Name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.companyhub.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `${this.$auth.subdomain} ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
      if (response.Errors && Object.keys(response.Errors).length > 0) {
        throw new ConfigurationError(JSON.stringify(response.Errors));
      }
      return response;
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/tables/Company",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/tables/Contact",
        ...opts,
      });
    },
    listDeals(opts = {}) {
      return this._makeRequest({
        path: "/tables/Deal",
        ...opts,
      });
    },
    listRecords({
      table, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${table}`,
        ...opts,
      });
    },
    createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tables/Company",
        ...opts,
      });
    },
    createDeal(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tables/Deal",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tables/Contact",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          start: 1,
          limit: 100,
        },
      };
      let hasMore, count = 0;
      do {
        const response = await fn(args);
        for (const item of response.Data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.start += 1;
        hasMore = response.HasMore;
      } while (hasMore);
    },
  },
};
