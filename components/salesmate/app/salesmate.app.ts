import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";
import { ROWS } from "../common/constants";
import queries from "../common/queries";
import {
  clearObj, getUrl,
} from "../common/utils";

export default defineApp({
  type: "app",
  app: "salesmate",
  propDefinitions: {
    billingAddressLine1: {
      label: "Billing Address Line 1",
      description: "Line one of the billing address of the contact.",
      type: "string",
    },
    billingAddressLine2: {
      label: "Billing Address Line 2",
      description: "Line two of the billing address of the contact.",
      type: "string",
    },
    billingCity: {
      label: "Billing City",
      description: "City name of contact's address for billing purposes.",
      type: "string",
    },
    billingCountry: {
      label: "Billing Country",
      description: "Country name of contact's address for billing purposes.",
      type: "string",
    },
    billingState: {
      label: "Billing State",
      description: "State name of contact's address for billing purposes.",
      type: "string",
    },
    billingZipCode: {
      label: "Billing Zip Code",
      description: "Zip code of the billing City.",
      type: "string",
    },
    company: {
      label: "Company",
      description: "The user can add a company for the contact from existing companies. If the contact's company is not defined, then the user can quickly add the company.",
      type: "integer",
      async options({ page }) {
        const { Data: { data } } = await this.listCompanies({
          params: {
            rows: ROWS,
            from: ROWS * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      label: "Contact Id",
      description: "The unique identifier of the contact.",
      type: "integer",
      async options({ page }) {
        const { Data: { data } } = await this.listContacts({
          params: {
            rows: ROWS,
            from: ROWS * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    currency: {
      label: "Currency",
      description: "The three-letter ISO currency code, in uppercase.",
      type: "string",
      async options() {
        const { Data } = await this.listCurrencies();

        return Data.map(({
          code: value, name,
        }) => ({
          label: `(${value}) - ${name}`,
          value,
        }));
      },
    },
    contactDescription: {
      label: "Description",
      description: "Description about the contact. It contains an arbitrary string attached to the contact object.",
      type: "string",
    },
    designation: {
      label: "Designation",
      description: "Contact's designation.",
      type: "string",
    },
    email: {
      label: "Email",
      description: "Email of the contact.",
      type: "string",
    },
    facebookHandle: {
      label: "Facebook Handle",
      description: "Contact's Facebook link.",
      type: "string",
    },
    firstName: {
      label: "First Name",
      description: "First name of the contact.",
      type: "string",
    },
    googlePlusHandle: {
      label: "Google Plus Handle",
      description: "Contact's Google Plus profile link.",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "Last name of the contact.",
      type: "string",
    },
    linkedInHandle: {
      label: "LinkedIn Handle",
      description: "Contact's LinkedIn profile link.",
      type: "string",
    },
    mobile: {
      label: "Mobile",
      description: "Mobile number of the contact.",
      type: "string",
    },
    otherPhone: {
      label: "Other Phone",
      description: "Phone number 2 of the contact.",
      type: "string",
    },
    owner: {
      label: "Owner",
      description: "Owner of the contact.",
      type: "integer",
      async options({ page }) {
        const { Data } = await this.listUsers({
          params: {
            rows: ROWS,
            from: ROWS * page,
          },
        });

        return Data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    phone: {
      label: "Phone",
      description: "Phone number 1 of the contact.",
      type: "string",
    },
    pipelineId: {
      label: "Pipeline",
      description: "Select a pipeline from pre-defined pipelines.",
      type: "string",
      async options({ page }) {
        const { Data } = await this.listPipelines({
          params: {
            rows: ROWS,
            from: ROWS * page,
          },
        });

        return Data.map(({ pipeline }) => (pipeline));
      },
    },
    priority: {
      label: "Priority",
      description: "Set the priority for the deal like high, low or medium.",
      type: "string",
      async options() {
        const { fieldOptions } = await this.listVisibleFields({
          module: "deal",
          field: "priority",
        });
        return JSON.parse(fieldOptions).values;
      },
    },
    skypeId: {
      label: "Skype Id",
      description: "Contact's Skype ID.",
      type: "string",
    },
    source: {
      label: "Source",
      description: "The source from where the contact came to know about the user's company or deal's information like ads, internet etc.",
      type: "string",
      async options() {
        const { fieldOptions } = await this.listVisibleFields({
          module: "deal",
          field: "source",
        });
        return JSON.parse(fieldOptions).values;
      },
    },
    stage: {
      label: "Stage",
      description: "The stage for a deal. like new, contacted, qualified, proposal presented or in negotiation.",
      type: "string",
      async options({ pipeline }) {
        const { Data } = await this.listStages({
          pipeline,
        });

        // It removes three additional props that don't represents a stage (dealsForecastAmount, dealsTotalAmount, dealsTotalCount)
        return Object.keys(Data).map((key) => key)
          .slice(0, -3);
      },
    },
    status: {
      label: "Status",
      description: "The deal's status like Open, Won or Lost. By default it is Open.",
      type: "string",
      async options() {
        const { fieldOptions } = await this.listVisibleFields({
          module: "deal",
          field: "status",
        });
        return JSON.parse(fieldOptions).values;
      },
    },
    tags: {
      label: "Tags",
      description: "The tags associated with the contact.",
      type: "string[]",
      async options({ page }) {
        const { Data } = await this.listTags({
          params: {
            rows: ROWS,
            from: ROWS * page,
          },
        });

        return Data.map(({ tag }) => (tag));
      },
    },
    twitterHandle: {
      label: "Twitter Handle",
      description: "Contact's Twitter link.",
      type: "string",
    },
    website: {
      label: "Website",
      description: "Website of the contact.",
      type: "string",
    },
  },
  methods: {
    _apiUrl(attr) {
      return getUrl({
        domain: this.$auth.domain,
        ...attr,
      });
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "accessToken": this.$auth.session_key,
        "x-linkname": this.$auth.linked_name,
      };
    },
    async _makeRequest({
      $ = this, path, action, version, ...opts
    }) {
      const config = {
        url: `${this._apiUrl({
          path,
          action,
          version,
        })}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, clearObj(config));
    },
    addContact(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "contact",
      });
    },
    addDeal(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "deal",
      });
    },
    listUsers({
      params, ...args
    }) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "core",
        action: "/users",
        params: {
          ...params,
          status: "active",
        },
      });
    },
    listCompanies(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "company",
        action: "/search",
        data: queries.listCompanies,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "contact",
        action: "/search",
        data: queries.listContacts,
      });
    },
    listCurrencies(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "lookups/active/currency",
        version: "v3",
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: "deal",
        action: "/search",
        data: queries.listDeals,
      });
    },
    listPipelines(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "apps/dealPipeline",
        version: "v3",
      });
    },
    async listStages({
      pipeline, ...args
    }) {
      return this._makeRequest({
        ...args,
        method: "POST",
        path: `board-view/${pipeline}/stage-wise-summary`,
        data: queries.listStages(pipeline),
        version: "v1deal",
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
        path: "tags",
        version: "v1",
      });
    },
    async listVisibleFields({
      $, module, field,
    }) {
      const { Data } = await this._makeRequest({
        $,
        method: "GET",
        path: "fields/getAllVisibleFields",
        version: "v3",
      });
      const items = Data[module];
      return items.filter((item) => (item.fieldName === field))[0];
    },
    updateContact({
      $, contactId, ...data
    }) {
      return this._makeRequest({
        $,
        method: "PUT",
        path: "contact",
        action: `/${contactId}`,
        data,
      });
    },
    async *paginate({
      fn, maxResults = null,
    }) {
      let rows = 0;
      let count = 0;
      let page = 0;
      const limit = 250;

      do {
        const {
          Data: {
            data,
            totalRows,
          },
        } = await fn({
          rows: limit,
          from: ++page * limit,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        rows = totalRows;
      } while (rows);
    },
  },
});
