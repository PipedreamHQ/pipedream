import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "helpspace",
  propDefinitions: {
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket",
      optional: false,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "Name of the customer",
      optional: false,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the customer",
      optional: false,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the customer",
      optional: true,
    },
    ticketTitle: {
      type: "string",
      label: "Ticket Title",
      description: "Title of the ticket",
      optional: false,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the ticket",
      optional: false,
    },
    attachment: {
      type: "string",
      label: "Attachment",
      description: "Attachment for the ticket",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category of the ticket",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer",
      optional: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.helpspace.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        data,
        params,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    async createTicket(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tickets",
        ...opts,
      });
    },
    async updateCustomer(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/customers/${opts.customerId}`,
        ...opts,
      });
    },
    async getNewCustomer(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/customers/new",
        ...opts,
      });
    },
    async getNewTicket(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/tickets/new",
        ...opts,
      });
    },
  },
};
