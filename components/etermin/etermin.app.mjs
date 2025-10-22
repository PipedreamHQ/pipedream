import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "etermin",
  propDefinitions: {
    updateWhenExistsgdt: {
      type: "boolean",
      label: "Update When Exists",
      description: "Set to `true` to check if the contact already exists. If found, the existing contact is updated. Requires email, or first name + last name + birthday.",
    },
    salutation: {
      type: "string",
      label: "Salutation",
      description: "Salutation or greeting prefix",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name",
    },
    company: {
      type: "string",
      label: "Company",
      description: "Name of the company associated with the contact",
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Contact's date of birth in YYYY-MM-DD format",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    id: {
      type: "string",
      label: "ID",
      description: "ID of the voucher",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the voucher",
    },
    priceInclVat: {
      type: "string",
      label: "Price Including VAT",
      description: "Price including VAT of the voucher",
    },
    isPercentage: {
      type: "boolean",
      label: "Is Percentage",
      description: "Indicates if the value of the voucher is a percentage",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "Email address of the customer receiving the offer",
    },
    validFrom: {
      type: "string",
      label: "Valid From",
      description: "Start date of validity in YYYY-MM-DD format",
    },
    validUntil: {
      type: "string",
      label: "Valid Until",
      description: "End date of validity in YYYY-MM-DD format",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.etermin.net/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "publickey": `${this.$auth.public_key}`,
          "salt": `${this.$auth.salt}`,
          "signature": `${this.$auth.signature}`,
          "accept": "application/json",
          "content-type": "application/json",
          ...headers,
        },
      });
    },

    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contact",
        method: "post",
        ...args,
      });
    },
    async createVoucher(args = {}) {
      return this._makeRequest({
        path: "/voucher",
        method: "post",
        ...args,
      });
    },
  },
};
