import { axios } from "@pipedream/platform";
import {
  CREDIT_TERMS_OPTIONS, LOCALE_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "sage_accounting",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact",
      async options() {
        const contacts = await this.listContacts();
        return contacts.map((contact) => ({
          label: contact.name || contact.displayed_as,
          value: contact.id,
        }));
      },
    },
    contactTypeIds: {
      type: "string[]",
      label: "Contact Type IDs",
      description: "The IDs of the Contact Types",
      async options() {
        const contactTypes = await this.listContactTypes();
        return contactTypes.map((contactType) => ({
          label: contactType.displayed_as,
          value: contactType.id,
        }));
      },
      default: [
        "CUSTOMER",
      ],
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "The ID of the Currency",
      async options() {
        const currencies = await this.listCurrencies();
        return currencies.map((currency) => ({
          label: currency.displayed_as,
          value: currency.id,
        }));
      },
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The contact's full name or business name",
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Unique reference for the contact",
      optional: true,
    },
    defaultSalesLedgerAccountId: {
      type: "string",
      label: "Default Sales Ledger Account ID",
      description: "The ID of the default sales ledger account for the contact",
      optional: true,
    },
    defaultSalesTaxRateId: {
      type: "string",
      label: "Default Sales Tax Rate ID",
      description: "The ID of the default sales tax rate for the contact",
      optional: true,
    },
    defaultPurchaseLedgerAccountId: {
      type: "string",
      label: "Default Purchase Ledger Account ID",
      description: "The ID of the default purchase ledger account for the contact",
      optional: true,
    },
    taxNumber: {
      type: "string",
      label: "Tax Number",
      description: "The VAT registration number of the contact. The format will be validated.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The notes for the contact",
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale for the contact",
      options: LOCALE_OPTIONS,
      optional: true,
    },
    creditLimit: {
      type: "string",
      label: "Credit Limit",
      description: "Custom credit limit amount for the contact (not applicable to Start)",
      optional: true,
    },
    creditDays: {
      type: "integer",
      label: "Credit Days",
      description: "Custom credit days for the contact (0-365)",
      min: 0,
      max: 365,
      optional: true,
    },
    creditTerms: {
      type: "string",
      label: "Credit Terms",
      description: "Credit terms options determine how invoice due dates are calculated",
      options: CREDIT_TERMS_OPTIONS,
      optional: true,
    },
    creditTermsAndConditions: {
      type: "string",
      label: "Credit Terms and Conditions",
      description: "Custom terms and conditions for the contact. If set will override global /invoice_settings default terms and conditions. (Customers only)",
      optional: true,
    },
    productSalesPriceTypeId: {
      type: "string",
      label: "Product Sales Price Type ID",
      description: "The ID of the product sales price type for the contact",
      optional: true,
    },
    sourceGuid: {
      type: "string",
      label: "Source GUID",
      description: "Used when importing contacts from external sources",
      optional: true,
    },
    auxReference: {
      type: "string",
      label: "Auxiliary Reference",
      description: "Auxiliary reference. Used for German 'Kreditorennummer' and 'Debitorennummer'",
      optional: true,
    },
    registeredNumber: {
      type: "string",
      label: "Registered Number",
      description: "The registered number of the contact's business. Only used for German businesses and represents the 'Steuernummer' there (not the 'USt-ID')",
      optional: true,
    },
    taxCalculation: {
      type: "string",
      label: "Tax Calculation",
      description: "Tax calculation method used to define tax treatment (varies by country)",
      optional: true,
    },
    auxiliaryAccount: {
      type: "string",
      label: "Auxiliary Account",
      description: "Auxiliary account - used when auxiliary accounting is enabled in business settings. Available only in Spain and France",
      optional: true,
    },
    destinationVatBlocking: {
      type: "boolean",
      label: "Destination VAT Blocking",
      description: "Identifies a contact should be blocked due to destination VAT",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.accounting.sage.com/v3.1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listContactTypes(opts = {}) {
      const response = await this._makeRequest({
        path: "/contact_types",
        ...opts,
      });
      return response.$items || response.items || [];
    },
    async listCurrencies(opts = {}) {
      const response = await this._makeRequest({
        path: "/currencies",
        ...opts,
      });
      return response.$items || response.items || [];
    },
    async listContacts(opts = {}) {
      const response = await this._makeRequest({
        path: "/contacts",
        ...opts,
      });
      return response.$items || response.items || [];
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    async getContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    async updateContact({
      $, contactId, data,
    }) {
      return this._makeRequest({
        $,
        path: `/contacts/${contactId}`,
        method: "PUT",
        data,
      });
    },
    async deleteContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
  },
};
