import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_invoice",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer.",
      async options({
        page, prevContext,
      }) {
        if (prevContext.hasMorePages === false) {
          return [];
        }
        const {
          contacts = [],
          page_context: { has_more_page: hasMorePages },
        } = await this.listCustomers({
          params: {
            page: page + 1,
          },
        });

        const options = contacts.map(({
          contact_id: value, contact_name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            hasMorePages,
          },
        };
      },
    },
    numberOfItems: {
      type: "integer",
      label: "How Many Items",
      description: "The number of items to create",
      default: 1,
      reloadProps: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Date format is `yyyy-mm-dd`",
    },
  },
  methods: {
    getBaseUrl() {
      return `${this.$auth.api_domain}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        "X-com-zoho-expense-organizationid": this.$auth.organization_id,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listEstimates(args = {}) {
      return this.makeRequest({
        path: "/estimates",
        ...args,
      });
    },
    listInvoices(args = {}) {
      return this.makeRequest({
        path: "/invoices",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this.makeRequest({
        path: "/customers",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let resourcesCount = 0;
      let page = 1;

      while (true) {
        const response = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs?.params,
            page,
          },
        });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            return;
          }
        }

        if (!response?.page_context?.has_more_page) {
          console.log("No more pages");
          return;
        }

        page += 1;
      }
    },
  },
};
