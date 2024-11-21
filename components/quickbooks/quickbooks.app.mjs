import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";
import { retryWithExponentialBackoff } from "./common/utils.mjs";

export default {
  type: "app",
  app: "quickbooks",
  propDefinitions: {
    invoiceId: {
      label: "Invoice ID",
      type: "string",
      description: "Id of the invoice to get details of.",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Invoice",
          mapper: ({
            Id: value, DocNumber: docNumber, CustomerRef: customerRef,
          }) => ({
            label: `(${docNumber}) ${customerRef.name}`,
            value,
          }),
        });
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
        return this.getPropOptions({
          page,
          resource: "Customer",
          mapper: ({
            Id: id, DisplayName: label,
          }) => ({
            label,
            value: id,
          }),
        });
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
        return this.getPropOptions({
          page,
          resource: "CompanyCurrency",
          mapper: ({
            Code: code, Name: name,
          }) => ({
            label: `${code} - ${name}`,
            value: JSON.stringify({
              value: code,
              name: name,
            }),
          }),
        });
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
        return this.getPropOptions({
          page,
          resource: "Purchase",
          mapper: ({
            Id, PaymentType, SyncToken,
          }) => ({
            label: `${Id} - ${PaymentType}`,
            value: `${Id}|${SyncToken}`,
          }),
        });
      },
    },
    suffix: {
      label: "Suffix",
      type: "string",
      description: "Suffix of the name. For example, `Jr`. The `DisplayName` attribute or at least one of `Title`, `GivenName`, `MiddleName`, `FamilyName`, or `Suffix` attributes is required for object create.",
      optional: true,
    },
    accountingMethod: {
      type: "string",
      label: "Accounting Method",
      description: "The accounting method used in the report",
      options: [
        "Cash",
        "Accrual",
      ],
      optional: true,
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "Column types to be shown in the report",
      optional: true,
    },
    termIds: {
      type: "string[]",
      label: "Term Ids",
      description: "Filters report contents based on term or terms supplied",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Term",
          mapper: ({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    vendorIds: {
      type: "string[]",
      label: "Vendor Ids",
      description: "Filters report contents to include information for specified vendors",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Vendor",
          mapper: ({
            Id: value, DisplayName: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    accountIds: {
      type: "string[]",
      label: "Account Ids",
      description: "Filters report contents to include information for specified accounts",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Account",
          mapper: ({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    classIds: {
      type: "string[]",
      label: "Class Ids",
      description: "Filters report contents to include information for specified classes if so configured in the company file",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Class",
          mapper: ({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    employeeIds: {
      type: "string[]",
      label: "Employee Ids",
      description: "Filters report contents to include information for specified employees",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Employee",
          mapper: ({
            Id: value, DisplayName: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    departmentIds: {
      type: "string[]",
      label: "Department Ids",
      description: "Filters report contents to include information for specified departments if so configured in the company file",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Department",
          mapper: ({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    itemId: {
      type: "string",
      label: "Item Id",
      description: "The identifier of an item",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Item",
          mapper: ({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    billId: {
      type: "string",
      label: "Bill Id",
      description: "The identifier of a bill",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Bill",
          mapper: ({ Id: id }) => id,
        });
      },
    },
    purchaseOrderId: {
      type: "string",
      label: "Item Id",
      description: "The identifier of a purchase order",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "PurchaseOrder",
          mapper: ({
            Id: value, DocNumber,
          }) => ({
            value,
            label: DocNumber ?? value,
          }),
        });
      },
    },
    salesReceiptId: {
      type: "string",
      label: "Sales Receipt Id",
      description: "The identifier of a sales receipt",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "SalesReceipt",
          mapper: ({
            Id: value, DocNumber,
          }) => ({
            value,
            label: DocNumber ?? value,
          }),
        });
      },
    },
    timeActivityId: {
      type: "string",
      label: "Time Activity Id",
      description: "The identifier of a time activity",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "TimeActivity",
          mapper: ({
            Id: value, NameOf: nameOf, Description: description,
          }) => ({
            value,
            label: `${nameOf} ${description}`,
          }),
        });
      },
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
    async _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      const requestFn = async () => {
        return await axios($, {
          url: `${this._apiUrl()}/${path}`,
          headers: {
            Authorization: `Bearer ${this._accessToken()}`,
            accept: "application/json",
          },
          ...opts,
        });
      };
      return await retryWithExponentialBackoff(requestFn);
    },
    async getPropOptions({
      page, resource, mapper,
    }) {
      const position = 1 + (page * 10);
      const { QueryResponse: queryResponse } = await this.query({
        params: {
          query: `select * from ${resource} maxresults 10${page
            ? `startposition ${position}`
            : ""} `,
        },
      });
      const items = queryResponse[resource];
      return items?.map(mapper) || [];
    },
    createPayment(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/payment`,
        method: "post",
        ...opts,
      });
    },
    createBill(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/bill`,
        method: "post",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/customer`,
        method: "post",
        ...opts,
      });
    },
    createPurchase(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/purchase`,
        method: "post",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/invoice`,
        method: "post",
        ...opts,
      });
    },
    deletePurchase(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/purchase`,
        method: "post",
        ...opts,
      });
    },
    sparseUpdateInvoice(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/invoice`,
        method: "post",
        ...opts,
      });
    },
    getBill({
      billId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/bill/${billId}`,
        ...opts,
      });
    },
    getCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/customer/${customerId}`,
        ...opts,
      });
    },
    getInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/invoice/${invoiceId}`,
        ...opts,
      });
    },
    getInvoices(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/query`,
        ...opts,
      });
    },
    getMyCompany(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/companyinfo/${this._companyId()}`,
        ...opts,
      });
    },
    getPurchase({
      purchaseId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/purchase/${purchaseId}`,
        ...opts,
      });
    },
    getPurchaseOrder({
      purchaseOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/purchaseorder/${purchaseOrderId}`,
        ...opts,
      });
    },
    getSalesReceipt({
      salesReceiptId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/salesreceipt/${salesReceiptId}`,
        ...opts,
      });
    },
    getTimeActivity({
      timeActivityId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/timeactivity/${timeActivityId}`,
        ...opts,
      });
    },
    query(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/query`,
        ...opts,
      });
    },
    updateCustomer(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/customer`,
        method: "post",
        ...opts,
      });
    },
    updateItem(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/item`,
        method: "post",
        ...opts,
      });
    },
    getApAgingReport(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/reports/AgedPayableDetail`,
        ...opts,
      });
    },
    getProfitLossReport(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/reports/ProfitAndLoss`,
        ...opts,
      });
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
