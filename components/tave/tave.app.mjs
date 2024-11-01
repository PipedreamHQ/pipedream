import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tave",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "ID of the client that is required.",
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "ID of the order that is required.",
    },
    managerId: {
      type: "string",
      label: "Manager ID",
      description: "Optional manager ID.",
      optional: true,
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "ID of the payment that is required.",
    },
    contact: {
      type: "object",
      label: "Contact Details",
      description: "Includes required fields like kind and details (name, email) and optional fields (phone, address).",
      properties: {
        kind: {
          type: "string",
          label: "Kind",
        },
        name: {
          type: "string",
          label: "Name",
        },
        email: {
          type: "string",
          label: "Email",
        },
        phone: {
          type: "string",
          label: "Phone",
          optional: true,
        },
        address: {
          type: "string",
          label: "Address",
          optional: true,
        },
      },
    },
    searchContact: {
      type: "string",
      label: "Contact Name or Email",
      description: "The name or email of the contact to search for.",
    },
    jobDetails: {
      type: "object",
      label: "Job Details",
      description: "Includes required client details, job specifics and optional additional items or notes.",
      properties: {
        clientDetails: {
          type: "object",
          label: "Client Details",
        },
        specifics: {
          type: "string",
          label: "Job Specifics",
        },
        additionalItems: {
          type: "string",
          label: "Additional Items",
          optional: true,
        },
        notes: {
          type: "string",
          label: "Notes",
          optional: true,
        },
        instructions: {
          type: "string",
          label: "Instructions",
          optional: true,
        },
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://tave.io/v2";
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
    async emitNewContactEvent(clientId) {
      return this._makeRequest({
        path: `/contacts/${clientId}/created`,
        method: "POST",
      });
    },
    async emitNewOrderEvent(orderId, managerId = null, clientId = null) {
      return this._makeRequest({
        path: `/orders/${orderId}/booked`,
        method: "POST",
        data: {
          manager_id: managerId,
          client_id: clientId,
        },
      });
    },
    async emitNewPaymentEvent(paymentId, orderId = null) {
      return this._makeRequest({
        path: `/payments/${paymentId}/created`,
        method: "POST",
        data: {
          order_id: orderId,
        },
      });
    },
    async createContact({
      kind, name, email, phone, address,
    }) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        data: {
          kind,
          name,
          email,
          phone,
          address,
        },
      });
    },
    async searchContact(contactIdentifier) {
      return this._makeRequest({
        path: "/contacts/search",
        method: "GET",
        params: {
          query: contactIdentifier,
        },
      });
    },
    async createJob({
      clientDetails, specifics, additionalItems, notes, instructions,
    }) {
      return this._makeRequest({
        path: "/jobs",
        method: "POST",
        data: {
          clientDetails,
          specifics,
          additionalItems,
          notes,
          instructions,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
