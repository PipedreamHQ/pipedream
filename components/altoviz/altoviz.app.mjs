import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "altoviz",
  propDefinitions: {
    contact: {
      type: "object",
      label: "Contact",
      description: "The contact that was manipulated",
    },
    product: {
      type: "object",
      label: "Product",
      description: "The product that was manipulated",
    },
    invoice: {
      type: "object",
      label: "Invoice",
      description: "The invoice that was manipulated",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice that needs to be sent",
    },
    productNumber: {
      type: "string",
      label: "Product Number",
      description: "The number of the product",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the product",
      optional: true,
    },
    price: {
      type: "number",
      label: "Price",
      description: "Price of the product",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.altoviz.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createContact(contact) {
      return this._makeRequest({
        method: "POST",
        path: "/Contacts",
        data: contact,
      });
    },
    async updateContact(contact) {
      return this._makeRequest({
        method: "PUT",
        path: `/Contacts/${contact.id}`,
        data: contact,
      });
    },
    async deleteContact(contact) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Contacts/${contact.id}`,
      });
    },
    async createProduct(product) {
      return this._makeRequest({
        method: "POST",
        path: "/Products",
        data: product,
      });
    },
    async updateProduct(product) {
      return this._makeRequest({
        method: "PUT",
        path: `/Products/${product.id}`,
        data: product,
      });
    },
    async deleteProduct(product) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Products/${product.id}`,
      });
    },
    async createInvoice(invoice) {
      return this._makeRequest({
        method: "POST",
        path: "/Invoices",
        data: invoice,
      });
    },
    async updateInvoice(invoice) {
      return this._makeRequest({
        method: "PUT",
        path: `/Invoices/${invoice.id}`,
        data: invoice,
      });
    },
    async deleteInvoice(invoice) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Invoices/${invoice.id}`,
      });
    },
    async createCustomer(customer) {
      return this._makeRequest({
        method: "POST",
        path: "/Customers",
        data: customer,
      });
    },
    async sendInvoice(invoiceId, email) {
      return this._makeRequest({
        method: "POST",
        path: `/Invoices/${invoiceId}/send`,
        data: {
          email,
        },
      });
    },
    async findOrCreateProduct(product) {
      let existingProduct;
      try {
        existingProduct = await this._makeRequest({
          path: `/Products/Find/${product.productNumber}`,
        });
      } catch (error) {
        if (error.response.status !== 404) {
          throw error;
        }
      }
      if (existingProduct) {
        return existingProduct;
      }
      return this.createProduct(product);
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
