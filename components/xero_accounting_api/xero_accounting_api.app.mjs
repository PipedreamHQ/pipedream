import { axios } from "@pipedream/platform";
import {
  BASE_URL, DB_LAST_DATE_CHECK,
} from "./common/constants.mjs";
import { chainQueryString } from "./common/util.mjs";

export default {
  type: "app",
  app: "xero_accounting_api",
  propDefinitions: {
    tenantId: {
      type: "string",
      label: "Tenant ID",
      description:
        "Select an organization tenant to use, or provide a tenant ID",
      async options() {
        const tenants = await this.getTenantConnections();

        return tenants.map(({
          tenantName: label, tenantId: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    trackingCategoryId: {
      type: "string",
      label: "Tracking Category ID",
      description: "Unique identification of the tracking category",
      async options({ tenantId }) {
        const { TrackingCategories: trackingCategories } = await this.getTrackingCategories({
          tenantId,
        });

        return trackingCategories.map(({
          TrackingCategoryID: value,
          Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    trackingOptionId: {
      type: "string",
      label: "Tracking Option ID",
      description: "Unique identification of the tracking option",
      async options({
        tenantId, trackingCategoryId,
      }) {
        const { TrackingCategories: trackingCategories } = await this.getTrackingCategory({
          tenantId,
          trackingCategoryId,
        });

        return trackingCategories[0].Options.map(({
          TrackingOptionID, Name,
        }) => ({
          label: Name,
          value: TrackingOptionID,
        }));
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "Unique identification of the invoice",
      async options({ tenantId }) {
        return this.getInvoiceOpts({
          tenantId,
        });
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Unique identification of the contact",
      async options({
        tenantId, page,
      }) {
        const { Contacts: contacts } = await this.getContact({
          tenantId,
          params: {
            page: page + 1,
          },
        });
        return contacts?.map(({
          ContactID: value, Name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`",
    },
  },
  methods: {
    setLastDateChecked(db, value) {
      db && db.set(DB_LAST_DATE_CHECK, value);
    },
    getLastDateChecked(db) {
      return db && db.get(DB_LAST_DATE_CHECK);
    },
    getHeader({
      tenantId, modifiedSince = null, headers = {},
    }) {
      const header = {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
      tenantId && (header["xero-tenant-id"] = tenantId);
      modifiedSince && (header["If-Modified-Since"] = modifiedSince);
      return header;
    },
    _makeRequest({
      $ = this,
      tenantId,
      modifiedSince,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${BASE_URL}/api.xro/2.0${path}`,
        headers: this.getHeader({
          tenantId,
          modifiedSince,
          headers,
        }),
        ...opts,
      });
    },
    getTenantConnections() {
      return this._makeRequest({
        url: BASE_URL + "/connections",
      });
    },
    async getInvoiceOpts({ tenantId }) {
      const invoices = await this.getInvoice({
        tenantId,
      });
      return invoices?.Invoices?.map((invoice) => ({
        label: invoice.InvoiceNumber,
        value: invoice.InvoiceID,
      })) || [];
    },
    createBankTransaction(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/BankTransactions",
        ...opts,
      });
    },
    createCreditNote(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/CreditNotes",
        ...opts,
      });
    },
    createHistoryNote({
      endpoint, guid, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/${endpoint}/${guid}/history`,
        ...opts,
      });
    },
    createItem(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/Items",
        ...opts,
      });
    },
    createPayment(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/Payments",
        ...opts,
      });
    },
    getContact({
      queryParam, ...opts
    }) {
      const where = chainQueryString(queryParam);
      return this._makeRequest({
        path: "/Contacts",
        params: where && {
          Where: where,
        },
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Invoices",
        ...opts,
      });
    },
    downloadInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/Invoices/${invoiceId}`,
        ...opts,
      });
    },
    emailInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Invoices/${invoiceId}/Email`,
        ...opts,
      });
    },
    getInvoice({
      queryParam, ...opts
    }) {
      const where = chainQueryString(queryParam);
      return this._makeRequest({
        path: "/Invoices",
        ...opts,
        params: where && {
          Where: where,
        },
      });
    },
    getInvoiceById({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/Invoices/${invoiceId}`,
        ...opts,
      });
    },
    getInvoiceOnlineUrl({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/Invoices/${invoiceId}/OnlineInvoice`,
        ...opts,
      });
    },
    getItemById({
      itemId, ...opts
    }) {
      return this._makeRequest({
        path: `/Items/${itemId}`,
        ...opts,
      });
    },
    getBankStatementsReport(opts = {}) {
      return this._makeRequest({
        path: "/Reports/BankStatement",
        ...opts,
      });
    },
    getBankSummary(opts = {}) {
      return this._makeRequest({
        path: "/Reports/BankSummary",
        ...opts,
      });
    },
    getContactById({
      contactIdentifier, ...opts
    }) {
      return this._makeRequest({
        path: `/Contacts/${contactIdentifier}`,
        ...opts,
      });
    },
    getHistoryOfChanges({
      endpoint, guid, ...opts
    }) {
      return this._makeRequest({
        path: `/${endpoint}/${guid}/history`,
        ...opts,
      });
    },
    getTrackingCategories(opts = {}) {
      return this._makeRequest({
        path: "/TrackingCategories",
        ...opts,
      });
    },
    getTrackingCategory({
      trackingCategoryId, ...opts
    }) {
      return this._makeRequest({
        path: `/TrackingCategories/${trackingCategoryId}`,
        ...opts,
      });
    },
    createTrackingCategory(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/TrackingCategories",
        ...opts,
      });
    },
    updateTrackingCategory({
      trackingCategoryId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/TrackingCategories/${trackingCategoryId}`,
        ...opts,
      });
    },
    deleteTrackingCategory({
      trackingCategoryId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/TrackingCategories/${trackingCategoryId}`,
        ...opts,
      });
    },
    createTrackingOption({
      trackingCategoryId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/TrackingCategories/${trackingCategoryId}/Options`,
        ...opts,
      });
    },
    updateTrackingOption({
      trackingCategoryId, trackingOptionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/TrackingCategories/${trackingCategoryId}/Options/${trackingOptionId}`,
        ...opts,
      });
    },
    deleteTrackingOption({
      trackingCategoryId, trackingOptionId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/TrackingCategories/${trackingCategoryId}/Options/${trackingOptionId}`,
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/Contacts",
        ...opts,
      });
    },
    listCreditNotes(opts = {}) {
      return this._makeRequest({
        path: "/CreditNotes",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/Invoices",
        ...opts,
      });
    },
    listManualJournals(opts = {}) {
      return this._makeRequest({
        path: "/ManualJournals",
        ...opts,
      });
    },
    uploadFile({
      documentType, documentId, fileName, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${documentType}/${documentId}/Attachments/${fileName}`,
        ...opts,
      });
    },
    createEmployee(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/Employees",
        ...opts,
      });
    },
    createOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Contacts",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/Contacts/${contactId}`,
        ...opts,
      });
    },
    listQuotes(opts = {}) {
      return this._makeRequest({
        path: "/Quotes",
        ...opts,
      });
    },
  },
};
