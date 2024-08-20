import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    invoiceId: {
      label: "Invoice ID",
      type: "string",
      description: "Id of the invoice to get details of.",
      async options({ page }) {
        const position = 1 + (page * 10);
        const { QueryResponse: { Invoice: records } } = await this.query({
          params: {
            query: `select * from invoice maxresults 10${page
              ? `startposition ${position}`
              : ""} `,
          },
        });

        return records?.map(({
          Id: value, DocNumber: docNumber, CustomerRef: customerRef,
        }) => ({
          label: `(${docNumber}) ${customerRef.name}`,
          value,
        })) || [];
      },
    },
    minorVersion: {
      label: "Minor Version",
      type: "string",
      description: "Use the `minorversion` query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
    lineItems: {
      label: "Line Items",
      type: "string[]",
      description: "Individual line items of a transaction. Valid Line types include: `ItemBasedExpenseLine` and `AccountBasedExpenseLine`. One minimum line item required for the request to succeed. E.g `[ { \"DetailType\": \"AccountBasedExpenseLineDetail\", \"Amount\": 100.0, \"AccountBasedExpenseLineDetail\": { \"AccountRef\": { \"name\": \"Meals and Entertainment\", \"value\": \"10\" } } } ]`",
    },
    customer: {
      label: "Customer Reference",
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference.",
      async options({ page }) {
        const position = 1 + (page * 10);
        const { QueryResponse: { Customer: records } } = await this.query({
          params: {
            query: `select * from Customer maxresults 10${page
              ? `startposition ${position}`
              : ""} `,
          },
        });

        return records?.map(({
          Id: id, DisplayName: label,
        }) => ({
          label,
          value: JSON.stringify({
            value: id,
            name: label,
          }),
        })) || [];
      },
    },
    customerRefName: {
      label: "Customer Reference Name",
      type: "string",
      description: "Reference to a customer or job. Query the Customer name list resource to determine the appropriate Customer object for this reference. Use `Customer.DisplayName ` from that object for `CustomerRef.name`.",
      optional: true,
    },
    currency: {
      label: "Currency Reference",
      type: "string",
      description: "This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      optional: true,
      async options({ page }) {
        const position = 1 + (page * 10);
        const { QueryResponse: { CompanyCurrency: records } } = await this.query({
          params: {
            query: `select * from companycurrency maxresults 10${page
              ? `startposition ${position}`
              : ""} `,
          },
        });

        return records?.map(({
          Code: code, Name: name,
        }) => ({
          label: `${code} - ${name}`,
          value: JSON.stringify({
            value: code,
            name: name,
          }),
        })) || [];
      },
    },
    currencyRefValue: {
      label: "Currency Reference Value",
      type: "string",
      description: "A three letter string representing the ISO 4217 code for the currency. For example, `USD`, `AUD`, `EUR`, and so on. This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      optional: true,
    },
    currencyRefName: {
      label: "Currency Reference Name",
      type: "string",
      description: "The full name of the currency.",
      optional: true,
    },
    includeClause: {
      description: "Fields to use in the select clause of the data query. See query language syntax, limitations, and other specifications on [Data queries](https://developer.intuit.com/app/developer/qbo/docs/develop/explore-the-quickbooks-online-api/data-queries)",
      label: "Include Clause",
      type: "string",
    },
    maxResults: {
      description: "The number of entity elements in the response.",
      label: "Max Results",
      optional: true,
      type: "string",
    },
    orderClause: {
      description: "The `orderClause` is for sorting the result. Include the property to sort by. The default sort order is ascending; to indicate descending sort order, include DESC, for example: `Name DESC`",
      label: "Order Clause",
      optional: true,
      type: "string",
    },
    startPosition: {
      description: "The starting count of the response for pagination.",
      label: "Start Position",
      optional: true,
      type: "string",
    },
    whereClause: {
      description: "Filters to use in the where clause of the data query. Note: Multiple clauses (filters) are AND'd. The OR operation is not supported.",
      label: "Where Clause",
      type: "string",
    },
    displayName: {
      label: "Display Name",
      type: "string",
      description: "The name of the person or organization as displayed. Must be unique across all Customer, Vendor, and Employee objects. Cannot be removed with sparse update. If not supplied, the system generates DisplayName by concatenating customer name components supplied in the request from the following list: `Title`, `GivenName`, `MiddleName`, `FamilyName`, and `Suffix`.",
      optional: true,
    },
    title: {
      label: "Title",
      type: "string",
      description: "Title of the person. This tag supports i18n, all locales. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, `Suffix`, or `FullyQualifiedName` attributes are required during create.",
      optional: true,
    },
    givenName: {
      label: "Given Name",
      type: "string",
      description: "Given name or first name of a person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    middleName: {
      label: "Middle Name",
      type: "string",
      description: "Middle name of the person. The person can have zero or more middle names. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    familyName: {
      label: "Family Name",
      type: "string",
      description: "Family name or the last name of the person. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    purchaseId: {
      label: "purchase Id",
      type: "string",
      description: "Id of the purchase.",
      withLabel: true,
      async options({ page }) {
        const position = 1 + (page * 10);
        const { QueryResponse: { Purchase: records } } = await this.query({
          params: {
            query: `select * from Purchase maxresults 10 ${page
              ? `startposition ${position}`
              : ""} `,
          },
        });

        return records?.map(({
          Id, PaymentType, SyncToken,
        }) => ({
          label: `${Id} - ${PaymentType}`,
          value: `${Id}|${SyncToken}`,
        })) || [];
      },
    },
    suffix: {
      label: "Suffix",
      type: "string",
      description: "Suffix of the name. For example, `Jr`. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
  },
  methods: {
    _companyId() {
      return this.$auth.company_id;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://quickbooks.api.intuit.com/v3";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
          accept: "application/json",
        },
        ...options,
      });
    },
    async createPayment({
      $, data,
    }) {
      return this._makeRequest(`company/${this._companyId()}/payment`, {
        method: "post",
        data,
      }, $);
    },
    async createBill({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/bill`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async createCustomer({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/customer`, {
        method: "post",
        data,
        params,
      }, $);
    },
    createPurchase({
      $, ...args
    }) {
      return this._makeRequest(`company/${this._companyId()}/purchase`, {
        method: "POST",
        ...args,
      }, $);
    },
    async createInvoice({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/invoice`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async deletePurchase({
      $, ...args
    }) {
      return this._makeRequest(`company/${this._companyId()}/purchase`, {
        method: "POST",
        ...args,
      }, $);
    },
    async sparseUpdateInvoice({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/invoice`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async getBill({
      $, billId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/bill/${billId}`, {
        params,
      }, $);
    },
    async getCustomer({
      $, customerId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/customer/${customerId}`, {
        params,
      }, $);
    },
    async getInvoice({
      $, invoiceId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/invoice/${invoiceId}`, {
        params,
      }, $);
    },
    async getInvoices({
      $, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/query`, {
        params,
      }, $);
    },
    async getMyCompany({ $ } = {}) {
      return this._makeRequest(`company/${this._companyId()}/companyinfo/${this._companyId()}`, {}, $);
    },
    async getPurchase({
      $, purchaseId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/purchase/${purchaseId}`, {
        params,
      }, $);
    },
    async getPurchaseOrder({
      $, purchaseOrderId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/purchaseorder/${purchaseOrderId}`, {
        params,
      }, $);
    },
    async getSalesReceipt({
      $, salesReceiptId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/salesreceipt/${salesReceiptId}`, {
        params,
      }, $);
    },
    async getTimeActivity({
      $, timeActivityId, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/timeactivity/${timeActivityId}`, {
        params,
      }, $);
    },
    async query({
      $, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/query`, {
        params,
      }, $);
    },
    async updateCustomer({
      $, data, params,
    }) {
      return this._makeRequest(`company/${this._companyId()}/customer`, {
        method: "post",
        data,
        params,
      }, $);
    },
    async *paginate({
      fn, params = {}, fieldList, query, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        const position = 1 + (page * LIMIT);
        params.query = query + ` maxresults ${LIMIT} ${page
          ? `startposition ${position}`
          : ""} `;
        page++;
        const { QueryResponse: queryResponse } = await fn({
          params,
          ...opts,
        });

        const items = queryResponse[fieldList];
        if (!items) {
          return false;
        }
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
