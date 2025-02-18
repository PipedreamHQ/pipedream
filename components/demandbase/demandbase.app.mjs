import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "demandbase",
  propDefinitions: {
    industries: {
      type: "string[]",
      label: "Industries",
      description: "List of industry IDs.",
      optional: true,
      async options({
        listSubindustries = false,
        industryIds,
      }) {
        const { industries } = await this.listIndustries();

        if (industryIds && listSubindustries) {
          return industryIds.flatMap((industryId) => {
            const industry =
              industries.find(({ industry: { industryId: id } }) => id === industryId);
            return industry?.subIndustries
              ?.map(({
                industryId: value,
                industryName: label,
              }) => ({
                label,
                value,
              })) || [];
          });
        }

        return industries.map(({
          industry: {
            industryId: value,
            industryName: label,
          },
        }) => ({
          label,
          value,
        }));
      },
    },
    countryId: {
      type: "string",
      label: "Country ID",
      description: "The country ID.",
      optional: true,
      async options({
        mapper = ({
          countryId: value,
          countryName: label,
        }) => ({
          label,
          value,
        }),
      }) {
        const { countries } = await this.listCountries();
        return countries.map(mapper);
      },
    },
    categoryIds: {
      type: "string[]",
      label: "Category IDs",
      description: "List of category IDs.",
      optional: true,
      async options() {
        const { categories } = await this.listTechnologies();
        return categories.map(({
          categoryId: value, categoryName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The company ID.",
      optional: true,
      async options({ page }) {
        const { companies } = await this.listCompanies({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          params: {
            page: page + 1,
            resultsPerPage: 100,
          },
        });
        return companies.map(({
          companyId: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.insideview.com/api/v1${path}`;
    },
    getHeaders(headers) {
      return {
        accessToken: this.$auth.oauth_access_token,
        Accept: "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listIndustries(args = {}) {
      return this._makeRequest({
        path: "/reference/industries",
        ...args,
      });
    },
    listCountries(args = {}) {
      return this._makeRequest({
        path: "/reference/countries",
        ...args,
      });
    },
    listTechnologies(args = {}) {
      return this._makeRequest({
        path: "/reference/techProfile",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.post({
        path: "/target/companies",
        ...args,
      });
    },
  },
};
