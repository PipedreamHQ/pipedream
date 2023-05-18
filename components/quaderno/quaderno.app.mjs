import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "quaderno",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice to retrieve.",
      async options() {
        const invoices = await this.listInvoices();
        return invoices.map(({
          id, contact,
        }) => ({
          value: String(id),
          label: contact?.full_name
            ? `${id} (${contact.full_name})`
            : id,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "2-letter [ISO country code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City/District/Suburb/Town/Village.",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "State/Province/Region.",
      optional: true,
    },
    streetLine1: {
      type: "string",
      label: "Street Line 1",
      description: "Address line 1 (Street address/PO Box).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address.",
      optional: true,
    },
    phone1: {
      type: "string",
      label: "Phone Number",
      description: "The contact's phone number.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "ZIP or postal code.",
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The contact's full name.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date on which payment for this invoice is due. Must be in `YYYY-MM-DD` format.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Three-letter [ISO currency code](https://en.wikipedia.org/wiki/ISO_4217), in uppercase.",
      optional: true,
    },
    recurringPeriod: {
      type: "string",
      label: "Recurring Period",
      description: "The period of time between each invoice. Can be `days`, `weeks`, `months`, `years`.",
      optional: true,
      options: Object.values(constants.PERIOD),
    },
    recurringFrequency: {
      type: "integer",
      label: "Recurring Frequency",
      description: "The number of periods between each invoice.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the invoice.",
      optional: true,
    },
    howManyItems: {
      type: "integer",
      label: "How Many Items",
      description: "The number of line items to add to the invoice.",
      reloadProps: true,
      default: 1,
    },
  },
  methods: {
    getBaseUrl() {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;
      return baseUrl.replace(constants.ACCOUNT_PLACEHOLDER, this.$auth.account_name)
        .replace(constants.DOMAIN_PLACEHOLDER, this.$auth.domain);
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getAuth() {
      return {
        username: this.$auth.api_key,
      };
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": `application/json; api_version=${constants.API_VERSION}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        auth: this.getAuth(),
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
    listInvoices(args = {}) {
      return this.makeRequest({
        path: "/invoices",
        ...args,
      });
    },
    listPayments(args = {}) {
      return this.makeRequest({
        path: "/payments",
        ...args,
      });
    },
  },
};
