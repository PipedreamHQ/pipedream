import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "booqable",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select the customer to update",
      async options({ page }) {
        const { customers } = await this.listCustomers({
          params: {
            page,
          },
        });
        return customers.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getBaseUrl() {
      const baseUrl =
        constants.BASE_URL
          .replace(constants.SUBDOMAIN_PLACEHOLDER, this.$auth.company_slug);
      return `${baseUrl}${constants.VERSION_PATH}`;
    },
    getParams(params) {
      return {
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    async makeRequest({
      step = this, path, summary, params, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getBaseUrl() + path,
        params: this.getParams(params),
      };

      const response = await axios(step, config);

      if (typeof(summary) === "function") {
        this.exportSummary(step)(summary(response));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this.makeRequest({
        path: "/customers",
        ...args,
      });
    },
    getCustomer({
      customerId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/customers/${customerId}`,
        ...args,
      });
    },
    listOrders(args = {}) {
      return this.makeRequest({
        path: "/orders",
        ...args,
      });
    },
    async *getIterations({
      resourceFn,
      resourceFnArgs,
      resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let page = 1;
      let resourcesCount = 0;

      while (true) {
        const response =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs?.params,
              page,
            },
          });

        console.log("response!!!", JSON.stringify(response, null, 2));
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

        page += 1;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
