import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "invoice_ninja",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Emit Events
    emitNewClientEvent: {
      type: "object",
      label: "Emit New Client Event",
      description: "Emits an event when a new client is added",
    },
    emitNewInvoiceEvent: {
      type: "object",
      label: "Emit New Invoice Event",
      description: "Emits an event when a new invoice is created",
    },
    emitNewPaymentEvent: {
      type: "object",
      label: "Emit New Payment Event",
      description: "Emits an event when a new payment is registered",
    },

    // Create Invoice Props
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client to associate with the invoice",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user creating the invoice",
      optional: true,
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    assignedUserId: {
      type: "string",
      label: "Assigned User ID",
      description: "The ID of the user to assign the invoice to",
      optional: true,
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "The status ID of the invoice",
      optional: true,
    },
    number: {
      type: "string",
      label: "Invoice Number",
      description: "The number of the invoice",
      optional: true,
    },
    poNumber: {
      type: "string",
      label: "PO Number",
      description: "Purchase Order number for the invoice",
      optional: true,
    },
    terms: {
      type: "string",
      label: "Terms",
      description: "Payment terms for the invoice",
      optional: true,
    },
    publicNotes: {
      type: "string",
      label: "Public Notes",
      description: "Public notes for the invoice",
      optional: true,
    },
    privateNotes: {
      type: "string",
      label: "Private Notes",
      description: "Private notes for the invoice",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "Footer content for the invoice",
      optional: true,
    },
    customValue1: {
      type: "string",
      label: "Custom Value 1",
      description: "Custom field 1 for the invoice",
      optional: true,
    },
    customValue2: {
      type: "string",
      label: "Custom Value 2",
      description: "Custom field 2 for the invoice",
      optional: true,
    },
    customValue3: {
      type: "string",
      label: "Custom Value 3",
      description: "Custom field 3 for the invoice",
      optional: true,
    },
    customValue4: {
      type: "string",
      label: "Custom Value 4",
      description: "Custom field 4 for the invoice",
      optional: true,
    },
    totalTaxes: {
      type: "integer",
      label: "Total Taxes",
      description: "Total taxes for the invoice",
      optional: true,
    },
    lineItems: {
      type: "string[]",
      label: "Line Items",
      description: "An array of line items in JSON format",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Total amount of the invoice",
      optional: true,
    },
    balance: {
      type: "integer",
      label: "Balance",
      description: "Balance remaining on the invoice",
      optional: true,
    },
    paidToDate: {
      type: "integer",
      label: "Paid To Date",
      description: "Amount paid to date for the invoice",
      optional: true,
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "Discount applied to the invoice",
      optional: true,
    },
    date: {
      type: "string",
      label: "Invoice Date",
      description: "Date of the invoice (YYYY-MM-DD)",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date for the invoice (YYYY-MM-DD)",
      optional: true,
    },

    // Create Client Props
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "An array of contact objects in JSON format",
    },
    countryId: {
      type: "string",
      label: "Country ID",
      description: "The ID of the country for the client",
      async options() {
        const countries = await this.getCountries();
        return countries.map((country) => ({
          label: country.name,
          value: country.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Client Name",
      description: "Name of the client",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the client",
      optional: true,
    },
    industryId: {
      type: "string",
      label: "Industry ID",
      description: "Industry ID of the client",
      optional: true,
    },
    sizeId: {
      type: "string",
      label: "Size ID",
      description: "Size ID of the client",
      optional: true,
    },
    address1: {
      type: "string",
      label: "Address 1",
      description: "Primary address line for the client",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "Secondary address line for the client",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the client",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the client",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the client",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the client",
      optional: true,
    },
    vatNumber: {
      type: "string",
      label: "VAT Number",
      description: "VAT number of the client",
      optional: true,
    },
    idNumber: {
      type: "string",
      label: "ID Number",
      description: "ID number of the client",
      optional: true,
    },
    groupSettingsId: {
      type: "string",
      label: "Group Settings ID",
      description: "Group settings ID for the client",
      optional: true,
      async options() {
        const groupSettings = await this.getGroupSettings();
        return groupSettings.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    classification: {
      type: "string",
      label: "Classification",
      description: "Classification of the client",
      optional: true,
    },

    // Record Payment Props
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The ID of the payment",
      optional: true,
    },
    clientContactId: {
      type: "string",
      label: "Client Contact ID",
      description: "The ID of the client's contact",
      optional: true,
    },
    typeId: {
      type: "string",
      label: "Type ID",
      description: "Type ID of the payment",
      optional: true,
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "Date of the payment (YYYY-MM-DD)",
      optional: true,
    },
    paymentAmount: {
      type: "integer",
      label: "Payment Amount",
      description: "Amount of the payment",
      optional: true,
    },
    companyGatewayId: {
      type: "string",
      label: "Company Gateway ID",
      description: "The ID of the company gateway",
      optional: true,
      async options() {
        const gateways = await this.getCompanyGateways();
        return gateways.map((gateway) => ({
          label: gateway.name,
          value: gateway.id,
        }));
      },
    },
    paymentNumber: {
      type: "string",
      label: "Payment Number",
      description: "Number of the payment",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.invoiceninja.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-TOKEN": this.$auth.api_token,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    },
    async emitNewClientEvent(client) {
      this.$emit("new_client", client);
    },
    async emitNewInvoiceEvent(invoice) {
      this.$emit("new_invoice", invoice);
    },
    async emitNewPaymentEvent(payment) {
      this.$emit("new_payment", payment);
    },
    async createNewInvoice(data) {
      const invoiceData = {
        client_id: this.clientId,
        user_id: this.userId,
        assigned_user_id: this.assignedUserId,
        status_id: this.statusId,
        number: this.number,
        po_number: this.poNumber,
        terms: this.terms,
        public_notes: this.publicNotes,
        private_notes: this.privateNotes,
        footer: this.footer,
        custom_value1: this.customValue1,
        custom_value2: this.customValue2,
        custom_value3: this.customValue3,
        custom_value4: this.customValue4,
        total_taxes: this.totalTaxes,
        line_items: this.lineItems
          ? this.lineItems.map(JSON.parse)
          : undefined,
        amount: this.amount,
        balance: this.balance,
        paid_to_date: this.paidToDate,
        discount: this.discount,
        date: this.date,
        due_date: this.dueDate,
        ...data,
      };
      const invoice = await this._makeRequest({
        method: "POST",
        path: "/invoices",
        data: invoiceData,
      });
      await this.emitNewInvoiceEvent(invoice);
      return invoice;
    },
    async createNewClient(data) {
      const clientData = {
        contacts: this.contacts.map(JSON.parse),
        country_id: this.countryId,
        name: this.name,
        website: this.website,
        private_notes: this.privateNotes,
        industry_id: this.industryId,
        size_id: this.sizeId,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        postal_code: this.postalCode,
        phone: this.phone,
        vat_number: this.vatNumber,
        id_number: this.idNumber,
        group_settings_id: this.groupSettingsId,
        classification: this.classification,
        ...data,
      };
      const client = await this._makeRequest({
        method: "POST",
        path: "/clients",
        data: clientData,
      });
      await this.emitNewClientEvent(client);
      return client;
    },
    async recordPayment(data) {
      const paymentData = {
        id: this.paymentId,
        client_id: this.clientId,
        client_contact_id: this.clientContactId,
        user_id: this.userId,
        type_id: this.typeId,
        date: this.paymentDate,
        amount: this.paymentAmount,
        company_gateway_id: this.companyGatewayId,
        number: this.paymentNumber,
        ...data,
      };
      const payment = await this._makeRequest({
        method: "POST",
        path: "/payments",
        data: paymentData,
      });
      await this.emitNewPaymentEvent(payment);
      return payment;
    },
    async getUsers() {
      return this._makeRequest({
        path: "/users",
      });
    },
    async getCountries() {
      return this._makeRequest({
        path: "/countries",
      });
    },
    async getGroupSettings() {
      return this._makeRequest({
        path: "/group_settings",
      });
    },
    async getCompanyGateways() {
      return this._makeRequest({
        path: "/company_gateways",
      });
    },
    async paginate(fn, initialOpts = {}) {
      const results = [];
      let page = 1;
      let more = true;
      while (more) {
        const response = await fn({
          page,
          ...initialOpts,
        });
        if (response.length > 0) {
          results.push(...response);
          page += 1;
        } else {
          more = false;
        }
      }
      return results;
    },
  },
};
