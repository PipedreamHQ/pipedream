import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sage_intacct",
  propDefinitions: {
    billKey: {
      type: "string",
      label: "Bill Key",
      description: "System-assigned unique key for the bill",
      async options({ prevContext: { offset = 0 } }) {
        const DEFAULT_LIMIT = 100;
        if (offset === null) {
          return [];
        }
        const { data: { "ia::result": bills } } = await this.listBills({
          params: {
            offset,
          },
        });
        const options = bills.map(({
          key: value,
          id: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            offset: bills.length === DEFAULT_LIMIT
              ? offset + DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    vendorKey: {
      type: "string",
      label: "Vendor Key",
      description: "System-assigned unique key for the vendor",
      async options({ prevContext: { offset = 0 } }) {
        const DEFAULT_LIMIT = 100;
        if (offset === null) {
          return [];
        }
        const { data: { "ia::result": vendors } } = await this.listVendors({
          params: {
            offset,
          },
        });
        const options = vendors.map(({
          key: value,
          id: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            offset: vendors.length === DEFAULT_LIMIT
              ? offset + DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    billNumber: {
      type: "string",
      label: "Bill Number",
      description: "Vendor-assigned identifier for the bill. You must specify a bill number when creating a bill unless document sequencing is configured.",
      optional: true,
    },
    vendorId: {
      type: "string",
      label: "Vendor ID",
      description: "Unique identifier of the vendor.",
      optional: true,
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "A number such as a purchase order or account number that might be useful in searches or reports.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Additional information about the bill.",
      optional: true,
    },
    createdDate: {
      type: "string",
      label: "Created Date",
      description: "Date the bill was created (YYYY-MM-DD format). Example: `2025-01-01`.",
    },
    postingDate: {
      type: "string",
      label: "Posting Date",
      description: "GL Posting date of the bill (YYYY-MM-DD format). Example: `2025-01-01`.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date for the bill (YYYY-MM-DD format). Example: `2025-01-01`.",
    },
    discountCutOffDate: {
      type: "string",
      label: "Discount Cut Off Date",
      description: "Date after which the discount for the bill is no longer valid (YYYY-MM-DD format). Example: `2025-01-01`.",
      optional: true,
    },
    recommendedPaymentDate: {
      type: "string",
      label: "Recommended Payment Date",
      description: "Recommended payment date for the bill (YYYY-MM-DD format). Example: `2025-01-01`.",
      optional: true,
    },
    paymentPriority: {
      type: "string",
      label: "Payment Priority",
      description: "The payment priority for this bill.",
      options: [
        "urgent",
        "high",
        "normal",
        "low",
      ],
      optional: true,
    },
    isOnHold: {
      type: "boolean",
      label: "Is On Hold",
      description: "Set to true to place this bill on hold.",
      optional: true,
    },
    isTaxInclusive: {
      type: "boolean",
      label: "Is Tax Inclusive",
      description: "Set to true if bill amounts already include taxes.",
      optional: true,
    },
    txnCurrency: {
      type: "string",
      label: "Transaction Currency",
      description: "The transaction currency to use for this bill.",
      optional: true,
    },
    lines: {
      type: "object",
      label: "Line Items",
      description: `Array of line items for the bill. Each item must include:

**Optional fields:**
- \`totalTxnAmount\`: The total transaction amount for the line item.
- \`memo\`: The memo for the line item.
- \`dimensions\`: The dimensions for the line item.

**Example:**
\`\`\`json
[
  {
    "glAccount": { "id": "6000" },
    "txnAmount": "100.00",
    "totalTxnAmount": "100.00",
    "memo": "Service charges",
    "dimensions": {
      "location": { "id": "4" },
      "department": { "id": "11" },
      "project": { "id": "8" },
      "customer": { "id": "1" },
    }
  }
]
\`\`\`
`,
    },
    vendorName: {
      type: "string",
      label: "Name",
      description: "Name of the vendor.",
    },
    vendorTaxId: {
      type: "string",
      label: "Tax ID",
      description: "Tax identification number of the vendor.",
      optional: true,
    },
    vendorCreditLimit: {
      type: "integer",
      label: "Credit Limit",
      description: "Credit limit for the vendor.",
      optional: true,
    },
    vendorBillingType: {
      type: "string",
      label: "Billing Type",
      description: "Type of billing for the vendor.",
      options: [
        "openItem",
        "balanceForward",
      ],
      optional: true,
    },
    vendorPaymentPriority: {
      type: "string",
      label: "Payment Priority",
      description: "The payment priority for this vendor.",
      options: [
        "urgent",
        "high",
        "normal",
        "low",
      ],
      optional: true,
    },
    vendorStatus: {
      type: "string",
      label: "Status",
      description: "Status of the vendor.",
      options: [
        "active",
        "inactive",
      ],
      optional: true,
    },
    vendorIsOnHold: {
      type: "boolean",
      label: "Is On Hold",
      description: "Set to true to put the vendor on hold.",
      optional: true,
    },
    vendorDoNotPay: {
      type: "boolean",
      label: "Do Not Pay",
      description: "Set to true to prevent payment to this vendor.",
      optional: true,
    },
    vendorNotes: {
      type: "string",
      label: "Notes",
      description: "Notes about the vendor.",
      optional: true,
    },
    vendorAccountNumber: {
      type: "string",
      label: "Vendor Account Number",
      description: "Account number that the vendor assigned to your company.",
      optional: true,
    },
    vendorPreferredPaymentMethod: {
      type: "string",
      label: "Preferred Payment Method",
      description: "Preferred payment method for the vendor.",
      options: [
        "printedCheck",
        "ach",
        "wireTransfer",
      ],
      optional: true,
    },
    vendorDiscountPercent: {
      type: "integer",
      label: "Discount Percent",
      description: "Discount percentage for the vendor.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.intacct.com/ia/api/v1${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    get(args = {}) {
      return this._makeRequest({
        ...args,
        method: "GET",
      });
    },
    post(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        ...args,
        method: "PATCH",
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        ...args,
        method: "DELETE",
      });
    },
    listBills(args = {}) {
      return this.get({
        path: "/objects/accounts-payable/bill",
        ...args,
      });
    },
    getBill({
      billKey, ...args
    } = {}) {
      return this.get({
        path: `/objects/accounts-payable/bill/${billKey}`,
        ...args,
      });
    },
    createBill(args = {}) {
      return this.post({
        path: "/objects/accounts-payable/bill",
        ...args,
      });
    },
    updateBill({
      billKey, ...args
    } = {}) {
      return this.patch({
        path: `/objects/accounts-payable/bill/${billKey}`,
        ...args,
      });
    },
    deleteBill({
      billKey, ...args
    } = {}) {
      return this.delete({
        path: `/objects/accounts-payable/bill/${billKey}`,
        ...args,
      });
    },
    listVendors(args = {}) {
      return this.get({
        path: "/objects/accounts-payable/vendor",
        ...args,
      });
    },
    getVendor({
      vendorKey, ...args
    } = {}) {
      return this.get({
        path: `/objects/accounts-payable/vendor/${vendorKey}`,
        ...args,
      });
    },
    createVendor(args = {}) {
      return this.post({
        path: "/objects/accounts-payable/vendor",
        ...args,
      });
    },
    updateVendor({
      vendorKey, ...args
    } = {}) {
      return this.patch({
        path: `/objects/accounts-payable/vendor/${vendorKey}`,
        ...args,
      });
    },
    deleteVendor({
      vendorKey, ...args
    } = {}) {
      return this.delete({
        path: `/objects/accounts-payable/vendor/${vendorKey}`,
        ...args,
      });
    },
  },
};
