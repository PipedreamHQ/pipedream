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
      description: "ID of the invoice to get details of",
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
    customer: {
      label: "Customer Reference",
      type: "string",
      description: "Reference to a customer or job",
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
    customerType: {
      label: "Customer Type",
      type: "string",
      description: "ID referencing the customer type assigned to a customer",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "CustomerType",
          mapper: ({
            Id: id, Name: label,
          }) => ({
            label,
            value: id,
          }),
        });
      },
    },
    paymentMethod: {
      label: "Payment Method",
      type: "string",
      description: "ID referencing a PaymentMethod object associated with this Customer object",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Payment Method",
          mapper: ({
            Id: id, Name: label,
          }) => ({
            label,
            value: id,
          }),
        });
      },
    },
    currency: {
      label: "Currency Code",
      type: "string",
      description: "A three letter string representing the ISO 4217 code for the currency. For example, `USD`, `AUD`, `EUR`, and so on. This must be defined if multicurrency is enabled for the company.\nMulticurrency is enabled for the company if `Preferences.MultiCurrencyEnabled` is set to `true`. Read more about multicurrency support [here](https://developer.intuit.com/docs?RedirectID=MultCurrencies). Required if multicurrency is enabled for the company.",
      optional: true,
      default: "USD",
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
    purchaseId: {
      label: "Purchase ID",
      type: "string",
      description: "ID of the purchase.",
      withLabel: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Purchase",
          mapper: ({
            Id, PaymentType, TxnDate,
          }) => ({
            label: `${Id} - ${PaymentType} - ${TxnDate}`,
            value: Id,
          }),
        });
      },
    },
    estimateId: {
      label: "Estimate ID",
      type: "string",
      description: "ID of the estimate to get details of",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Estimate",
          mapper: ({
            Id: value, DocNumber: docNumber, CustomerRef: customerRef,
          }) => ({
            label: `${docNumber
              ? `(${docNumber}) `
              : ""}${customerRef.name}`,
            value,
          }),
        });
      },
    },
    vendor: {
      label: "Vendor Reference",
      type: "string",
      description: "Reference to a vendor",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Vendor",
          mapper: ({
            Id: id, DisplayName: label,
          }) => ({
            label,
            value: id,
          }),
        });
      },
    },
    termIds: {
      type: "string[]",
      label: "Term IDs",
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
      label: "Vendor IDs",
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
      label: "Account IDs",
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
      label: "Class IDs",
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
      label: "Employee IDs",
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
      label: "Department IDs",
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
      label: "Item ID",
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
      label: "Bill ID",
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
      label: "Purchase Order ID",
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
      label: "Sales Receipt ID",
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
      label: "Time Activity ID",
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
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The identifier of a payment",
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "Payment",
          mapper: ({
            Id: value, CustomerRef: customerRef, TotalAmt: totalAmt, TxnDate: txnDate,
          }) => ({
            value,
            label: `${customerRef.name} - Amount: ${totalAmt} - ${txnDate}`,
          }),
        });
      },
    },
    taxCodeId: {
      type: "string",
      label: "Tax Code ID",
      description: "The identifier of a tax code",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "TaxCode",
          mapper: ({
            Id: value, Name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    taxClassificationId: {
      type: "string",
      label: "Tax Classification ID",
      description: "The identifier of a tax classification",
      optional: true,
      async options({ page }) {
        return this.getPropOptions({
          page,
          resource: "TaxClassification",
          mapper: ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    lineItemsAsObjects: {
      type: "boolean",
      label: "Enter Line Items as Objects",
      description: "Enter line items as an array of objects",
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
    billingStreetAddress: {
      type: "string",
      label: "Billing Street Address",
      description: "The street address of the billing address",
      optional: true,
    },
    billingCity: {
      type: "string",
      label: "Billing City",
      description: "The city of the billing address",
      optional: true,
    },
    billingState: {
      type: "string",
      label: "Billing State",
      description: "The state of the billing address",
      optional: true,
    },
    billingZip: {
      type: "string",
      label: "Billing Zip",
      description: "The zip code of the billing address",
      optional: true,
    },
    billingLatitude: {
      type: "string",
      label: "Billing Latitude",
      description: "The latitude of the billing address",
      optional: true,
    },
    billingLongitude: {
      type: "string",
      label: "Billing Longitude",
      description: "The longitude of the billing address",
      optional: true,
    },
    shippingStreetAddress: {
      type: "string",
      label: "Shipping Street Address",
      description: "The street address of the shipping address",
      optional: true,
    },
    shippingCity: {
      type: "string",
      label: "Shipping City",
      description: "The city of the shipping address",
      optional: true,
    },
    shippingState: {
      type: "string",
      label: "Shipping State",
      description: "The state of the shipping address",
      optional: true,
    },
    shippingZip: {
      type: "string",
      label: "Shipping Zip",
      description: "The zip code of the shipping address",
      optional: true,
    },
    shippingLatitude: {
      type: "string",
      label: "Shipping Latitude",
      description: "The latitude of the shipping address",
      optional: true,
    },
    shippingLongitude: {
      type: "string",
      label: "Shipping Longitude",
      description: "The longitude of the shipping address",
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
    async _makeRequest({
      $ = this,
      path,
      params,
      ...opts
    }) {
      const requestFn = async () => {
        return await axios($, {
          url: `${this._apiUrl()}/${path}`,
          headers: {
            Authorization: `Bearer ${this._accessToken()}`,
            accept: "application/json",
          },
          params: {
            ...params,
            minorversion: 75,
          },
          ...opts,
        });
      };
      return await retryWithExponentialBackoff(requestFn);
    },
    async getPropOptions({
      page = 0, resource, mapper,
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
    sendInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/invoice/${invoiceId}/send`,
        method: "post",
        ...opts,
      });
    },
    updateInvoice(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/invoice`,
        method: "post",
        params: {
          operation: "update",
        },
        ...opts,
      });
    },
    voidInvoice(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/invoice`,
        method: "post",
        params: {
          operation: "void",
        },
        ...opts,
      });
    },
    createPurchaseOrder(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/purchaseorder`,
        method: "post",
        ...opts,
      });
    },
    createEstimate(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/estimate`,
        method: "post",
        ...opts,
      });
    },
    sendEstimate({
      estimateId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/estimate/${estimateId}/send`,
        method: "post",
        ...opts,
      });
    },
    updateEstimate(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/estimate`,
        method: "post",
        params: {
          operation: "update",
        },
        ...opts,
      });
    },
    getEstimate({
      estimateId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/estimate/${estimateId}`,
        ...opts,
      });
    },
    createSalesReceipt(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/salesreceipt`,
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
    getPayment({
      paymentId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/payment/${paymentId}`,
        ...opts,
      });
    },
    getItem({
      itemId, ...opts
    }) {
      return this._makeRequest({
        path: `company/${this._companyId()}/item/${itemId}`,
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
    getBalanceSheetReport(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/reports/BalanceSheet`,
        ...opts,
      });
    },
    getCashFlowReport(opts = {}) {
      return this._makeRequest({
        path: `company/${this._companyId()}/reports/CashFlow`,
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
