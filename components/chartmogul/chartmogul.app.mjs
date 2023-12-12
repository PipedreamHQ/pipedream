import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chartmogul",
  propDefinitions: {
    attributes: {
      type: "object",
      label: "Attributes",
      description: "A JSON object containing additional attributes of the customer in the form of tags and custom attributes as described below.",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the customer's location.",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The customer's company or organisation.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country code of customer's location as per [ISO-3166 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) standard.",
    },
    custom: {
      type: "string[]",
      label: "Custom",
      description: "An Array containing the custom attributes to be added to the customer. If sending custom attributes, each custom attribute must be an object and have a `type`, `key`, and `value`. E.g. `{\"type\":\"String\",\"key\": \"key1\",\"value\": \"value1\"}`",
    },
    customerId: {
      type: "string",
      label: "Customer UUID",
      description: "The ChartMogul UUID of the customer that needs to be updated. Specified as part of the URL.",
      async options({ page }) {
        const { entries } = await this.listCustomers({
          params: {
            page: ++page,
          },
        });

        return entries.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customers to whom custom attributes must be added.",
      async options({ page }) {
        const { entries } = await this.listCustomers({
          params: {
            page: ++page,
          },
        });

        return entries.map(({
          email, name,
        }) => ({
          label: `${name} - ${email}`,
          value: email,
        }));
      },
    },
    dataSourceId: {
      type: "string",
      label: "Data Source UUID",
      description: "The ChartMogul UUID of the data source that this customer comes from.",
      async options({ page }) {
        const { data_sources: data } = await this.listDataSources({
          params: {
            page: ++page,
          },
        });

        return data.map(({
          uuid: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the required period of data. An [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date, e.g. `2015-05-12`",
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "A unique identifier specified by you for the customer. Typically an identifier from your internal system. Accepts alphanumeric characters.",
    },
    freeTrialStartedAt: {
      type: "string",
      label: "Free Trial Started At",
      description: "Time at which this customer started a free trial of your product or service. Must be an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted time in the past. The timezone defaults to UTC unless otherwise specified. This is expected to be the same as, or after the lead_created_at value.",
    },
    geo: {
      type: "string[]",
      label: "Geo",
      description: "An array of [ISO 3166-1 Alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) formatted country codes to filter the results to, e.g. US,GB,DE.",
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "One of `day`, `week`, or `month`(default)",
      options: [
        "day",
        "week",
        "month",
      ],
    },
    leadCreatedAt: {
      type: "string",
      label: "Lead Created At",
      description: "Time at which this customer was established as a lead. Must be an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted time in the past. The timezone defaults to UTC unless otherwise specified.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer for display purposes. Accepts alphanumeric characters.",
    },
    plans: {
      type: "string[]",
      label: "Plans",
      description: "An array of plan names (as configured in your ChartMogul account) to filter the results to. Note that the names are case-sensitive",
    },
    source: {
      type: "string",
      label: "Source",
      description: "Optional parameter for UI use. Can be updated, doesn't show in response.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the required period of data. An [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date, e.g. `2015-05-12`",
    },
    state: {
      type: "string",
      label: "State",
      description: "State code of customer's location as per [ISO-3166 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) standard.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An Array of tags to be added to the customer.",
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the customer's location.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.chartmogul.com/v1";
    },
    _getAuth() {
      return {
        "username": this.$auth.account_token,
        "password": this.$auth.secret_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        ...opts,
      };

      return axios($, config);
    },
    addInfoViaEmail({
      $, info, ...data
    }) {
      return this._makeRequest({
        $,
        path: `customers/attributes/${info}`,
        method: "POST",
        data,
      });
    },
    addInfoViaUUID({
      $, info, customerId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `customers/${customerId}/attributes/${info}`,
        method: "POST",
        data,
      });
    },
    createCustomer({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "customers",
        method: "POST",
        data,
      });
    },
    getCustomer({
      $, customerId,
    }) {
      return this._makeRequest({
        $,
        path: `customers/${customerId}`,
      });
    },
    getMetrics({
      $, metric, ...opts
    }) {
      return this._makeRequest({
        $,
        path: `metrics/${metric}`,
        ...opts,
      });
    },
    mergeCustomer({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "customers/merges",
        method: "POST",
        data,
      });
    },
    updateCustomer({
      $, customerId, ...data
    }) {
      return this._makeRequest({
        $,
        path: `customers/${customerId}`,
        method: "PATCH",
        data,
      });
    },
    listDataSources({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "data_sources",
        ...opts,
      });
    },
    listCustomers({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "customers",
        ...opts,
      });
    },
    searchCustomers({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "customers/search",
        ...opts,
      });
    },
    async *paginate({
      $, fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          entries,
          has_more,
        } = await fn({
          $,
          params,
        });
        for (const d of entries) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = has_more;

      } while (hasMore);
    },
  },
};
