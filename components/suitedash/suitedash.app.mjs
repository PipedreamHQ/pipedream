import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "suitedash",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      async options({ page }) {
        const { data } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          uid: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the new company.",
    },
    role: {
      type: "string",
      label: "Company Role",
      description: "The role of the new company.",
      options: [
        "Lead",
        "Client",
        "Prospect",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.suitedash.com/secure-api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Accept": "application/json",
          "X-Public-ID": this.$auth.public_id,
          "X-Secret-Key": this.$auth.secret_key,
        },
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/company",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    updateCompany({
      companyId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/company/${companyId}`,
        ...opts,
      });
    },
    async *paginate({
      fn,
      params,
    }) {
      params = {
        ...params,
        page: 1,
      };
      let hasMore;
      do {
        const {
          data, meta: { pagination },
        } = await fn({
          params,
        });
        for (const item of data) {
          yield item;
        }
        hasMore = params.page < pagination.totalPages;
        params.page++;
      } while (hasMore);
    },
  },
};
