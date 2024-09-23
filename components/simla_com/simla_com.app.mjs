import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "simla_com",
  propDefinitions: {
    countryIso: {
      type: "string",
      label: "Country ISO",
      description: "The ISO code of the customer's country (ISO 3166-1 alpha-2).",
      async options() {
        const { countriesIso } = await this.listCountries();
        return countriesIso;
      },
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "The type of the order.",
      async options() {
        const { orderTypes } = await this.listOrderTypes();
        return Object.values(orderTypes)
          .map(({
            code: value, name: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    site: {
      type: "string",
      label: "Site",
      description: "The site of the order.",
      async options() {
        const { sites } = await this.listSites();
        return Object.values(sites)
          .map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
      },
    },
    customerType: {
      type: "string",
      label: "Customer Type",
      description: "The type of the customer.",
      options: Object.values(constants.CUSTOMER_TYPE),
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
      async options({
        page, customerType, params,
      }) {
        const isCustomer = customerType === constants.CUSTOMER_TYPE.CUSTOMER.value;
        const args = {
          params: {
            ...params,
            page: page + 1,
          },
        };
        const fieldName = isCustomer
          ? "customers"
          : "customersCorporate";
        const { [fieldName]: customers } =
          isCustomer
            ? await this.listCustomers(args)
            : await this.listCorporateCustomers(args);
        return customers.map(({
          id: value, firstName, lastName, site,
        }) => ({
          label: isCustomer
            ? [
              firstName,
              lastName,
            ].join(" ")
            : site,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      const {
        subdomain,
        version,
      } = this.$auth;
      const baseUrl = constants.BASE_URL
        .replace(constants.SUBDOMAIN_PLACEHOLDER, subdomain)
        .replace(constants.VERSION_PLACEHOLDER, version);
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "X-API-KEY": this.$auth.api_key,
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
    listCountries(args = {}) {
      return this._makeRequest({
        path: "/reference/countries",
        ...args,
      });
    },
    listOrderTypes(args = {}) {
      return this._makeRequest({
        path: "/reference/order-types",
        ...args,
      });
    },
    listSites(args = {}) {
      return this._makeRequest({
        path: "/reference/sites",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers",
        ...args,
      });
    },
    listCorporateCustomers(args = {}) {
      return this._makeRequest({
        path: "/customers-corporate",
        ...args,
      });
    },
    listCustomerChangeHistory(args = {}) {
      return this._makeRequest({
        path: "/customers/history",
        ...args,
      });
    },
    listOrders(args = {}) {
      return this._makeRequest({
        path: "/orders",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      lastDateAt, dateField,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              page,
            },
          });

        const nextResources = utils.getNestedProperty(response, resourceName);

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          const isDateGreater =
            lastDateAt
              && Date.parse(resource[dateField]) >= Date.parse(lastDateAt);

          if (!lastDateAt || isDateGreater) {
            yield resource;
            resourcesCount += 1;
          }

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        if (nextResources.length < constants.DEFAULT_LIMIT) {
          console.log("No next page found");
          return;
        }

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
