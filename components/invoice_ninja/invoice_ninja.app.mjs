import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "invoice_ninja",
  propDefinitions: {
    // Create Invoice Props
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client to associate with the invoice",
      async options({ page }) {
        const { data } = await this.getClients({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, ...client
        }) => ({
          label: `${client.display_name || client.name} ${client.email
            ? `(${client.email})`
            : ""}}`,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user creating the invoice",
      async options({ page }) {
        const { data } = await this.getUsers({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, ...user
        }) => ({
          label: `${user.email || `${user.first_name} ${user.last_name}`}`,
          value,
        }));
      },
    },
    industryId: {
      type: "string",
      label: "Industry ID",
      description: "Industry ID of the client",
      async options() {
        const { industries } = await this.getStatics();
        return industries.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sizeId: {
      type: "string",
      label: "Size ID",
      description: "Size ID of the client",
      async options() {
        const { sizes } = await this.getStatics();
        return sizes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
      optional: true,
    },
    // Create Client Props
    countryId: {
      type: "string",
      label: "Country ID",
      description: "The ID of the country for the client",
      async options() {
        const { countries } = await this.getStatics();
        return countries.map(({
          id: value, name, iso_3166_3: iso,
        }) => ({
          label: `${name} (${iso})`,
          value,
        }));
      },
    },
    groupSettingsId: {
      type: "string",
      label: "Group Settings ID",
      description: "Group settings ID for the client",
      async options({ page }) {
        const { data } = await this.getGroupSettings({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    // Record Payment Props
    clientContactId: {
      type: "string",
      label: "Client Contact ID",
      description: "The ID of the client's contact",
      async options({ clientId }) {
        const { data: { contacts } } = await this.showClient({
          clientId,
        });
        return contacts.map(({
          id: value, ...contact
        }) => ({
          label: `${contact.first_name} ${contact.last_name} ${contact.email
            ? `(${contact.email})`
            : ""}`,
          value,
        }));
      },
    },
    typeId: {
      type: "string",
      label: "Type ID",
      description: "The Payment Type ID",
      async options() {
        const { payment_types: data } = await this.getStatics();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyGatewayId: {
      type: "string",
      label: "Company Gateway ID",
      description: "The ID of the company gateway",
      async options() {
        const { data } = await this.getCompanyGateways();
        return data.map(({
          id: value, config: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://invoicing.co/api/v1";
    },
    _headers() {
      return {
        "X-Api-Token": this.$auth.api_token,
        "X-Requested-With": "XMLHttpRequest",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createNewInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/invoices",
        ...opts,
      });
    },
    createNewClient(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/clients",
        ...opts,
      });
    },
    recordPayment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/payments",
        ...opts,
      });
    },
    getClients() {
      return this._makeRequest({
        path: "/clients",
      });
    },
    getUsers() {
      return this._makeRequest({
        path: "/users",
      });
    },
    getStatics() {
      return this._makeRequest({
        path: "/statics",
      });
    },
    getGroupSettings() {
      return this._makeRequest({
        path: "/group_settings",
      });
    },
    getCompanyGateways() {
      return this._makeRequest({
        path: "/company_gateways",
      });
    },
    showClient({ clientId }) {
      return this._makeRequest({
        path: `/clients/${clientId}`,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
