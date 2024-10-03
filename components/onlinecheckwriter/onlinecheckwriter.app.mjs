import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onlinecheckwriter",
  propDefinitions: {
    bankAccountId: {
      type: "string",
      label: "Bank Account ID",
      description: "Must be a bank account ID.",
      async options({ page }) {
        const { data: { bankAccounts } } = await this.listBankAccounts({
          params: {
            page,
          },
        });
        return bankAccounts.map(({
          bankAccountId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    payeeId: {
      type: "string",
      label: "Payee ID",
      description: "Must be a payee ID.",
      async options({ page }) {
        const { data: { payees } } = await this.listPayees({
          params: {
            page,
          },
        });
        return payees.map(({
          payeeId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "Must be a category ID.",
      optional: true,
      async options({ page }) {
        const { data: { categories } } = await this.listCategories({
          params: {
            page,
          },
        });
        return categories.map(({
          categoryId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "By default it will be check creation date, If an **Issue Date** is passed, that will override any default. Eg. `2021-12-31`.",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The money value of the check.",
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Max of 150 characters to be included on the memo line of the check.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "An internal note that identifies this check. Must be no longer than 150 characters.",
      optional: true,
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Any invoice number associated with this check",
      optional: true,
    },
    noSign: {
      type: "boolean",
      label: "No Sign",
      description: "if `true`, the check will be created without signature. Default `false`.",
      optional: true,
    },
    noAmount: {
      type: "boolean",
      label: "No Amount",
      description: "if `true`, the check will be created without amount. Default `false`",
      optional: true,
    },
    noDate: {
      type: "boolean",
      label: "No Date",
      description: "if `true`, the check will be created without date. Default `false`",
      optional: true,
    },
    noPayee: {
      type: "boolean",
      label: "No Payee",
      description: "if `true`, the check will be created without payee. Default `false`",
      optional: true,
    },
    customFromAddressId: {
      type: "string",
      label: "Custom From Address ID",
      description: "Must be a custom from address ID.",
      optional: true,
      async options({ page }) {
        const { data: { addresses } } = await this.listCustomFromAddresses({
          params: {
            page,
          },
        });
        return addresses.map(({
          customFromAddressId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customToAddressId: {
      type: "string",
      label: "Custom To Address ID",
      description: "Must be a custom to address ID.",
      optional: true,
      async options({ page }) {
        const { data: { addresses } } = await this.listCustomToAddresses({
          params: {
            page,
          },
        });
        return addresses.map(({
          customToAddressId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    shippingTypeId: {
      type: "string",
      label: "Shipping Type ID",
      description: "Must be a valid shipping type ID.",
      optional: true,
      options: [
        {
          label: "First Class",
          value: "1",
        },
        {
          label: "First Class with Tracking",
          value: "3",
        },
        {
          label: "Priority Mail",
          value: "4",
        },
        {
          label: "Express Mail",
          value: "5",
        },
        {
          label: "Standard Overnight -Fedex-By 3pm the next business day",
          value: "12",
        },
        {
          label: "Fedex Saturday Delivery",
          value: "20",
        },
      ],
    },
    checkId: {
      type: "string",
      label: "Check ID",
      description: "Must be a check ID.",
      async options({
        page, params,
      }) {
        const { data: { checks } } = await this.listChecks({
          params: {
            ...params,
            page,
          },
        });
        return checks.map(({
          checkId: value, payee: {
            name, payeeId,
          }, amount,
        }) => ({
          label: `${name || payeeId} - $${amount}`,
          value,
        }));
      },
    },
    paperTypeId: {
      type: "string",
      label: "Paper Type ID",
      description: "Must be a valid paper type ID.",
      options: [
        {
          label: "Regular Check Paper",
          value: "7",
        },
        {
          label: "Hollogram Check Paper",
          value: "8",
        },
        {
          label: "Ultra Hollogram Check Paper",
          value: "9",
        },
      ],
    },
    informTypeId: {
      type: "string",
      label: "Inform Type ID",
      description: "Must be a valid inform type ID.",
      optional: true,
      options: [
        {
          label: "Notify Receiver by Sms",
          value: "10",
        },
      ],
    },
    enableSmsInform: {
      type: "boolean",
      label: "Enable SMS Inform",
      description: "Value is `true` if SMS inform is enabled. Default `false`",
      optional: true,
    },
    payeeEmail: {
      type: "string",
      label: "Payee Email",
      description: "The email address of the payee.",
      optional: true,
    },
    payeePhone: {
      type: "string",
      label: "Payee Phone",
      description: "The phone number of the payee.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      const { environment } = this.$auth;
      return `${environment}/api/v3${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });

      if (response.success === false) {
        throw new Error(JSON.stringify(response));
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listBankAccounts(args = {}) {
      return this._makeRequest({
        path: "/bankAccounts",
        ...args,
      });
    },
    listPayees(args = {}) {
      return this._makeRequest({
        path: "/payees",
        ...args,
      });
    },
    listCategories(args = {}) {
      return this._makeRequest({
        path: "/categories",
        ...args,
      });
    },
    listCustomFromAddresses(args = {}) {
      return this._makeRequest({
        path: "/customFromAddresses",
        ...args,
      });
    },
    listCustomToAddresses(args = {}) {
      return this._makeRequest({
        path: "/customToAddresses",
        ...args,
      });
    },
    listChecks(args = {}) {
      return this._makeRequest({
        path: "/checks",
        ...args,
      });
    },
  },
};
