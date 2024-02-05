import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jobber",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
    },
    clientName: {
      type: "string",
      label: "Client Name",
      description: "The name of the client",
    },
    clientContactInfo: {
      type: "string",
      label: "Client Contact Information",
      description: "The contact information of the client",
    },
    clientAddress: {
      type: "string",
      label: "Client Address",
      description: "The address of the client",
    },
    serviceDetails: {
      type: "string",
      label: "Service Details",
      description: "Details of the service request",
    },
    appointmentTime: {
      type: "string",
      label: "Appointment Time",
      description: "The appointment time for the service",
    },
    quoteDetails: {
      type: "string",
      label: "Quote Details",
      description: "Details of the quote including service, price, and terms",
    },
    servicePrice: {
      type: "string",
      label: "Service Price",
      description: "The price of the service",
    },
    quoteTerms: {
      type: "string",
      label: "Quote Terms",
      description: "The terms of the quote",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getjobber.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createClient({
      clientName, clientContactInfo, clientAddress,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        data: {
          name: clientName,
          contact_info: clientContactInfo,
          address: clientAddress,
        },
      });
    },
    async createServiceRequest({
      clientId, serviceDetails, appointmentTime,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/service_requests",
        data: {
          client_id: clientId,
          service_details: serviceDetails,
          appointment_time: appointmentTime,
        },
      });
    },
    async createQuote({
      clientId, quoteDetails, servicePrice, quoteTerms,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/quotes",
        data: {
          client_id: clientId,
          quote_details: quoteDetails,
          service_price: servicePrice,
          quote_terms: quoteTerms,
        },
      });
    },
  },
};
