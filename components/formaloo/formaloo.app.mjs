import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "formaloo",
  propDefinitions: {
    city: {
      type: "string",
      label: "City",
      description: "Customer's city slug",
      async options({
        page, prevContext, stateSlug,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const { data } = await this.listCities({
          params: {
            state: stateSlug,
            page: page + 1,
          },
        });

        return {
          options: data?.cities.map(({
            slug: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: data?.next,
          },
        };
      },
    },
    countrySlug: {
      type: "string",
      label: "Country",
      description: "Customer's country slug",
      async options({
        page, prevContext,
      }) {
        if (page && !prevContext.next) {
          return [];
        }
        const { data } = await this.listCountries({
          params: {
            page: page + 1,
          },
        });

        return {
          options: data?.countries.map(({
            slug: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: data?.next,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer Code",
      description: "Customer's code",
      async options({
        page, prevContext,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const { data } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        return {
          options: data?.customers.map(({
            code: value, email: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: data?.next,
          },
        };
      },
    },
    customerData: {
      type: "object",
      label: "Customer Data",
      description: "Any data available on the customer in json format.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Customer's primary email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Customer's first name.",
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "Customer's full name (in case it's not stored as the first name and last name).",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Customer's last name.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Customer's language slug.",
      async options({ page }) {
        const { data } = await this.listLanguages({
          params: {
            page,
          },
        });

        return data?.languages.map(({
          slug: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    numberOfTags: {
      type: "integer",
      label: "Number Of Tags",
      description: "The number of tags you want to add.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Customer's primary phone number.",
    },
    score: {
      type: "integer",
      label: "Score",
      description: "If you want the customer have an initial score.",
    },
    stateSlug: {
      type: "string",
      label: "State",
      description: "Customer's state slug",
      async options({
        page, prevContext, countrySlug,
      }) {
        if (page && !prevContext.next) {
          return [];
        }

        const { data } = await this.listStates({
          countrySlug,
          params: {
            page: page + 1,
          },
        });

        return {
          options: data?.states.map(({
            slug: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: data?.next,
          },
        };
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "Any username or identifier on your system which you use to identify the customer.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.formaloo.net/v2.0";
    },
    _getHeaders() {
      return {
        "Authorization": `JWT ${this.$auth.oauth_access_token}`,
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}/`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        path: "customers",
        method: "POST",
        ...args,
      });
    },
    listCities(args = {}) {
      return this._makeRequest({
        path: "cities",
        ...args,
      });
    },
    listCountries(args = {}) {
      return this._makeRequest({
        path: "countries",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "customers",
        ...args,
      });
    },
    listLanguages(args = {}) {
      return this._makeRequest({
        path: "languages",
        ...args,
      });
    },
    listStates({
      countrySlug, ...args
    }) {
      return this._makeRequest({
        path: `countries/${countrySlug}/states`,
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tags",
        ...args,
      });
    },
    updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        path: `customers/${customerId}`,
        method: "PUT",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, object, maxResults = null,
    }) {
      let hasNextPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { data } = await fn({
          params,
        });
        const { next } = data;

        for (const d of data[object]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasNextPage = next;

      } while (hasNextPage);
    },
  },
};
