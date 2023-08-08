import { axios } from "@pipedream/platform";

export default {
  key: "quaderno-create-invoice",
  name: "Create Invoice",
  description: "Generate a new invoice in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Invoices/operation/createInvoice).",
  type: "action",
  version: "0.0.1",
  props: {
    quaderno: {
      type: "app",
      app: "quaderno",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The customer's first name who will be billed.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The customer's last name who will be billed.",
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
    country: {
      type: "string",
      label: "Country",
      description: "2-letter [ISO country code](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes).",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "ZIP or postal code.",
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
  additionalProps() {
    return Array.from({
      length: this.howManyItems,
    }).reduce((props, _, idx) => {
      const counter = idx + 1;
      const item = `item${counter}`;
      const label = `Item ${counter}:`;
      const description = `${item}${SEP}description`;
      const discountRate = `${item}${SEP}discountRate`;
      const productCode = `${item}${SEP}productCode`;
      const quantity = `${item}${SEP}quantity`;
      const totalAmount = `${item}${SEP}totalAmount`;
      const unitPrice = `${item}${SEP}unitPrice`;
      return {
        ...props,
        [description]: {
          type: "string",
          label: `${label} Description`,
          description: "The description of the item.",
          optional: true,
        },
        [discountRate]: {
          type: "string",
          label: `${label} Discount Rate`,
          description: "Discount percent out of 100, if applicable.",
          optional: true,
        },
        [productCode]: {
          type: "string",
          label: `${label} Product Code`,
          description: "The SKU of the Quaderno **Product** being invoiced. Use this attribute if you want to track your sales per product.",
          optional: true,
        },
        [quantity]: {
          type: "integer",
          label: `${label} Quantity`,
          description: "The quantity of the item.",
          optional: true,
          default: 1,
        },
        [totalAmount]: {
          type: "string",
          label: `${label} Total Amount`,
          description: "The total amount to be charged after discounts and taxes. Required if **Unit Price** is not passed.",
          optional: true,
        },
        [unitPrice]: {
          type: "string",
          label: `${label} Unit Price`,
          description: "The unit price of the item before any discount or tax is applied. Required if **Total Amount** is not passed.",
          optional: true,
        },
      };
    }, {});
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
    createInvoice(args = {}) {
      return this.post({
        path: "/invoices",
        ...args,
      });
    },
    getItems(length) {
      return Array.from({
        length,
      }).map((_, idx) => {
        const counter = idx + 1;
        const item = `item${counter}`;
        const description = this[`${item}${SEP}description`];
        const discountRate = this[`${item}${SEP}discountRate`];
        const productCode = this[`${item}${SEP}productCode`];
        const quantity = this[`${item}${SEP}quantity`];
        const totalAmount = this[`${item}${SEP}totalAmount`];
        const unitPrice = this[`${item}${SEP}unitPrice`];
        return {
          description,
          discount_rate: discountRate,
          product_code: productCode,
          quantity,
          total_amount: totalAmount,
          unit_price: unitPrice,
        };
      });
    },
  },
  async run({ $: step }) {
    const {
      firstName,
      lastName,
      dueDate,
      currency,
      recurringPeriod,
      recurringFrequency,
      country,
      postalCode,
      region,
      streetLine1,
      howManyItems,
    } = this;

    const response = await this.createInvoice({
      step,
      data: {
        contact: {
          first_name: firstName,
          last_name: lastName,
        },
        due_date: dueDate,
        currency,
        recurring_period: recurringPeriod,
        recurring_frequency: recurringFrequency,
        country,
        postal_code: postalCode,
        region,
        street_line_1: streetLine1,
        items_attributes: this.getItems(howManyItems),
      },
    });

    step.export("$summary", `Successfully created invoice with ID ${response.id}`);

    return response;
  },
};

const DOMAIN_PLACEHOLDER = "{domain}";
const ACCOUNT_PLACEHOLDER = "{account_name}";
const BASE_URL = `https://${ACCOUNT_PLACEHOLDER}.${DOMAIN_PLACEHOLDER}`;
const VERSION_PATH = "/api";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

const API_VERSION = "20220325";

const CONTACT_TYPE = {
  PERSON: "person",
  COMPANY: "company",
};

const PERIOD = {
  DAYS: "days",
  WEEKS: "weeks",
  MONTHS: "months",
  YEARS: "years",
};

const SEP = "_";

const WEBHOOK_ID = "webhookId";
const AUTH_KEY = "authKey";

const constants = {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  API_VERSION,
  DOMAIN_PLACEHOLDER,
  ACCOUNT_PLACEHOLDER,
  CONTACT_TYPE,
  PERIOD,
  SEP,
  WEBHOOK_ID,
  AUTH_KEY,
};
