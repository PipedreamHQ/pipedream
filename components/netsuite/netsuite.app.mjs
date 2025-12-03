import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "netsuite",
  propDefinitions: {
    salesOrderId: {
      type: "string",
      label: "Sales Order ID",
      description: "The internal identifier of the sales order",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const offset = page * limit;
        const { items } = await this.listSalesOrders({
          params: {
            limit,
            offset,
          },
        });
        return items?.map((order) => ({
          label: order.tranId || `Order ${order.id}`,
          value: order.id,
        })) || [];
      },
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The internal identifier of the invoice",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const offset = page * limit;
        const { items } = await this.listInvoices({
          params: {
            limit,
            offset,
          },
        });
        return items?.map((invoice) => ({
          label: invoice.tranId || `Invoice ${invoice.id}`,
          value: invoice.id,
        })) || [];
      },
    },
    subsidiaryId: {
      type: "string",
      label: "Subsidiary ID",
      description: "The internal identifier of the subsidiary",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const offset = page * limit;
        const { items } = await this.listSubsidiaries({
          params: {
            limit,
            offset,
          },
        });
        return items?.map((subsidiary) => ({
          label: subsidiary.name || `Subsidiary ${subsidiary.id}`,
          value: subsidiary.id,
        })) || [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The internal identifier of the customer",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const offset = page * limit;
        const { items } = await this.listCustomers({
          params: {
            limit,
            offset,
          },
        });
        return items?.map((customer) => ({
          label: customer.entityId || customer.companyName || `Customer ${customer.id}`,
          value: customer.id,
        })) || [];
      },
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query used to filter results",
      optional: true,
    },
    expandSubResources: {
      type: "boolean",
      label: "Expand Sub Resources",
      description: "Set to true to automatically expand all sublists, sublist lines, and subrecords",
      optional: true,
      default: false,
    },
    simpleEnumFormat: {
      type: "boolean",
      label: "Simple Enum Format",
      description: "Set to true to return enumeration values showing only the internal ID value",
      optional: true,
      default: false,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of field names to return (only selected fields will be returned)",
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: `Array of item objects to add to the sales order. Each item should be a JSON object with the following properties:

**Required:**
- \`item\` - Item ID or reference object (e.g., \`{ "id": "123" }\`)
- \`quantity\` - Quantity to order (number)

**Important Optional:**
- \`rate\` - Price per unit (number)
- \`amount\` - Total line amount (number, usually \`quantity * rate\`)
- \`description\` - Custom description for the line item (string)
- \`location\` - Inventory location ID or reference object

**Example:**
\`\`\`json
[
  {
    "item": { "id": "456" },
    "quantity": 2,
    "rate": 99.99,
    "amount": 199.98,
    "description": "Custom widget - blue",
    "location": { "id": "1" }
  }
]
\`\`\``,
      optional: true,
    },
    propertyNameValidation: {
      type: "string",
      label: "Property Name Validation",
      description: "Sets the strictness of property name validation",
      options: Object.values(constants.VALIDATION_OPTIONS),
      optional: true,
    },
    propertyValueValidation: {
      type: "string",
      label: "Property Value Validation",
      description: "Sets the strictness of property value validation",
      options: Object.values(constants.VALIDATION_OPTIONS),
      optional: true,
    },
    replace: {
      type: "string",
      label: "Replace Sublists",
      description: "Comma-separated names of sublists on this record. All sublist lines will be replaced with lines specified in the request.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://${this.$auth.account_id}.suitetalk.api.netsuite.com/services/rest/record/v1${path}`;
    },
    _headers(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        debug: true,
        url: this.getUrl(path),
        headers: this._headers(headers),
        ...opts,
      });
    },
    listSalesOrders(opts = {}) {
      return this._makeRequest({
        path: "/salesOrder",
        ...opts,
      });
    },
    getSalesOrder({
      salesOrderId, opts,
    } = {}) {
      return this._makeRequest({
        path: `/salesOrder/${salesOrderId}`,
        ...opts,
      });
    },
    createSalesOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/salesOrder",
        ...opts,
      });
    },
    updateSalesOrder({
      salesOrderId, opts,
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/salesOrder/${salesOrderId}`,
        ...opts,
      });
    },
    deleteSalesOrder({
      salesOrderId, opts,
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/salesOrder/${salesOrderId}`,
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/invoice",
        ...opts,
      });
    },
    getInvoice({
      invoiceId, opts,
    } = {}) {
      return this._makeRequest({
        path: `/invoice/${invoiceId}`,
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoice",
        ...opts,
      });
    },
    updateInvoice({
      invoiceId, opts,
    } = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `/invoice/${invoiceId}`,
        ...opts,
      });
    },
    deleteInvoice({
      invoiceId, opts,
    } = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/invoice/${invoiceId}`,
        ...opts,
      });
    },
    listSubsidiaries(opts = {}) {
      return this._makeRequest({
        path: "/subsidiary",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customer",
        ...opts,
      });
    },
    async *paginate({
      fn, fnArgs = {}, maxResults = constants.DEFAULT_MAX_RESULTS, fieldKey = "items",
    }) {
      const limit = constants.DEFAULT_LIMIT;
      let offset = 0;
      let total = 0;

      while (true) {
        const response = await fn({
          ...fnArgs,
          params: {
            ...fnArgs.params,
            limit,
            offset,
          },
        });

        const items = response[fieldKey] || [];

        for (const item of items) {
          yield item;
          total++;

          if (maxResults && total >= maxResults) {
            return;
          }
        }

        if (items.length < limit) {
          return;
        }

        offset += limit;
      }
    },
  },
};
