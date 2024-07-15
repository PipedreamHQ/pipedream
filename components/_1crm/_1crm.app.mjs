import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_1crm",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account",
    },
    accountDetails: {
      type: "object",
      label: "Account Details",
      description: "Details of the account",
    },
    accountStatus: {
      type: "string",
      label: "Account Status",
      description: "Status of the account",
    },
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
    },
    invoiceDetails: {
      type: "object",
      label: "Invoice Details",
      description: "Details of the invoice",
    },
    invoiceStatus: {
      type: "string",
      label: "Invoice Status",
      description: "Status of the invoice",
    },
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The ID of the lead",
    },
    leadDetails: {
      type: "object",
      label: "Lead Details",
      description: "Details of the lead",
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "Status of the lead",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the contact",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
      optional: true,
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the contact",
    },
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "Name of the lead",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name of the lead",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the lead",
      optional: true,
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Name of the account",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Contact details of the customer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}/api.php`;
    },
    _auth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.password}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      };
      console.log("config: ", config);

      return axios($, config);
    },
    getFields({ module }) {
      return this._makeRequest({
        path: `/meta/${module}`,
      });
    },
    createContact({
      firstName, lastName, email, address, phoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/data/Contacts",
        data: {
          first_name: firstName,
          last_name: lastName,
          email1: email,
          primary_address_street: address,
          phone_work: phoneNumber,
        },
      });
    },
    updateContact({
      contactId, firstName, lastName, email, address, phoneNumber,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/data/Contacts/${contactId}`,
        data: {
          first_name: firstName,
          last_name: lastName,
          email1: email,
          primary_address_street: address,
          phone_work: phoneNumber,
        },
      });
    },
    createLead({
      leadName, email, companyName, description,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/data/Leads",
        data: {
          name: leadName,
          email1: email,
          account_name: companyName,
          description,
        },
      });
    },
    updateLead({
      leadId, leadName, email, companyName, description,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/data/Leads/${leadId}`,
        data: {
          name: leadName,
          email1: email,
          account_name: companyName,
          description,
        },
      });
    },
    findAccount({
      accountName, contactDetails,
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/data/Accounts",
        params: {
          name: accountName,
          ...contactDetails,
        },
      });
    },
    createWebhook({
      type, url, model, filters,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          type,
          url,
          model,
          filters,
        },
      });
    },
    updateWebhook({
      id, type, url, model, filters,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/webhooks/${id}`,
        data: {
          type,
          url,
          model,
          filters,
        },
      });
    },
    emitAccountEvent({
      accountDetails, accountStatus,
    }) {
      return this.createWebhook({
        type: "create_update",
        url: "https://your-webhook-url.com",
        model: "Accounts",
        filters: {
          glue: "and",
          conditions: [
            {
              field: "details",
              value: accountDetails,
            },
            {
              field: "status",
              value: accountStatus,
            },
          ],
        },
      });
    },
    emitInvoiceEvent({
      invoiceDetails, invoiceStatus,
    }) {
      return this.createWebhook({
        type: "create_update",
        url: "https://your-webhook-url.com",
        model: "Invoices",
        filters: {
          glue: "and",
          conditions: [
            {
              field: "details",
              value: invoiceDetails,
            },
            {
              field: "status",
              value: invoiceStatus,
            },
          ],
        },
      });
    },
    emitLeadEvent({
      leadDetails, leadStatus,
    }) {
      return this.createWebhook({
        type: "create_update",
        url: "https://your-webhook-url.com",
        model: "Leads",
        filters: {
          glue: "and",
          conditions: [
            {
              field: "details",
              value: leadDetails,
            },
            {
              field: "status",
              value: leadStatus,
            },
          ],
        },
      });
    },
  },
};
