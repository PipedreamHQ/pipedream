import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_expense",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const { organizations = [] } = await this.listOrganizations();
        return organizations.map(({
          organization_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "The ID of the currency",
      async options({ organizationId }) {
        const { currencies = [] } = await this.listCurrencies({
          headers: {
            organizationId,
          },
        });
        return currencies.map(({
          currency_id: value, currency_code: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tripId: {
      type: "string",
      label: "Trip ID",
      description: "The ID of the trip",
      async options({ organizationId }) {
        const { trips = [] } = await this.listTrips({
          headers: {
            organizationId,
          },
        });
        return trips.map(({
          trip_id: value, description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    expenseReportId: {
      type: "string",
      label: "Expense Report ID",
      description: "The ID of the expense report",
      async options({ organizationId }) {
        const { expense_reports = [] } = await this.listExpenseReports({
          headers: {
            organizationId,
          },
        });
        return expense_reports.map(({
          report_id: value, report_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${this.$auth.api_domain}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders({
      organizationId, ...headers
    } = {}) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        "X-com-zoho-expense-organizationid": organizationId,
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
    put(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this.makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    listCurrencies(args = {}) {
      return this.makeRequest({
        path: "/settings/currencies",
        ...args,
      });
    },
    listExpenseCategories(args = {}) {
      return this.makeRequest({
        path: "/expensecategories",
        ...args,
      });
    },
    listExpenses(args = {}) {
      return this.makeRequest({
        path: "/reports/expensedetails",
        ...args,
      });
    },
    listTrips(args = {}) {
      return this.makeRequest({
        path: "/trips",
        ...args,
      });
    },
    listExpenseReports(args = {}) {
      return this.makeRequest({
        path: "/expensereports",
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
