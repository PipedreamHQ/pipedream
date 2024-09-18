import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "the_bookie",
  propDefinitions: {
    addressBookId: {
      type: "string",
      label: "Address Book ID",
      description: "The ID of the address book",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any extra notes for the contact",
      optional: true,
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "The number of the invoice",
    },
    clientIdentifier: {
      type: "string",
      label: "Client Identifier",
      description: "The identifier of the client",
    },
    productServiceDetails: {
      type: "string[]",
      label: "Product or Service Details",
      description: "The details of the product or service",
    },
    appliedDiscounts: {
      type: "string",
      label: "Applied Discounts",
      description: "Any applied discounts",
      optional: true,
    },
    taxInformation: {
      type: "string",
      label: "Tax Information",
      description: "Any tax information",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the invoice",
      optional: true,
    },
    paymentTerms: {
      type: "string",
      label: "Payment Terms",
      description: "The payment terms of the invoice",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thebookie.nl";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
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
    async emitContactCreatedUpdated({
      addressBookId, contactId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events/contacts",
        data: {
          addressBookId,
          contactId,
        },
      });
    },
    async emitInvoicePaid({ invoiceId }) {
      return this._makeRequest({
        method: "POST",
        path: `/events/invoices/${invoiceId}/paid`,
      });
    },
    async emitInvoiceCreated({
      invoiceId, customerId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/events/invoices",
        data: {
          invoiceId,
          customerId,
        },
      });
    },
    async createContact({
      name, email, phoneNumber, address, notes,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          name,
          email,
          phoneNumber,
          address,
          notes,
        },
      });
    },
    async createInvoice({
      invoiceNumber, clientIdentifier, productServiceDetails, appliedDiscounts, taxInformation, dueDate, paymentTerms,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        data: {
          invoiceNumber,
          clientIdentifier,
          productServiceDetails,
          appliedDiscounts,
          taxInformation,
          dueDate,
          paymentTerms,
        },
      });
    },
    async searchCreateContact({
      addressBookId, name, email, phoneNumber, address, notes,
    }) {
      const searchResponse = await this._makeRequest({
        method: "GET",
        path: `/addressbooks/${addressBookId}/contacts/search`,
        params: {
          name,
          email,
          phoneNumber,
        },
      });

      if (searchResponse && searchResponse.length > 0) {
        return searchResponse[0]; // Return the first matching contact
      } else {
        // If contact is not found, create a new one
        return this.createContact({
          name,
          email,
          phoneNumber,
          address,
          notes,
        });
      }
    },
  },
};
