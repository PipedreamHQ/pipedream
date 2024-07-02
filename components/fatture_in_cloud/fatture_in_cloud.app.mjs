import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fatture_in_cloud",
  propDefinitions: {
    companyid: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
    },
    eventtype: {
      type: "string",
      label: "Event Type",
      description: "The type of the event",
    },
    clientid: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the client",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The code of the client",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the client",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the client",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the client",
      optional: true,
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "The VAT number of the client",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the client",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the client",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fattureincloud.it/v1";
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
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitEnrichedEventWebhook({
      companyid, eventtype,
    }) {
      this.$emit({
        companyid,
        eventtype,
      }, {
        summary: `New enriched event: ${eventtype}`,
        id: `${companyid}-${eventtype}`,
      });
    },
    async emitRawEventWebhook({
      companyid, eventtype,
    }) {
      this.$emit({
        companyid,
        eventtype,
      }, {
        summary: `New raw event: ${eventtype}`,
        id: `${companyid}-${eventtype}`,
      });
    },
    async createClient({
      companyid, name, code, type, firstName, lastName, vatNumber, email, phone,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/companies/${companyid}/clients`,
        data: {
          name,
          code,
          type,
          first_name: firstName,
          last_name: lastName,
          vat_number: vatNumber,
          email,
          phone,
        },
      });
    },
    async listClients({ companyid }) {
      return this._makeRequest({
        path: `/companies/${companyid}/clients`,
      });
    },
    async removeClient({
      companyid, clientid,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/companies/${companyid}/clients/${clientid}`,
      });
    },
  },
};
