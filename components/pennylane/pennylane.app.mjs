import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pennylane",
  propDefinitions: {
    // Emit event when a billing subscription is created
    billingSubscriptionFilters: {
      type: "string[]",
      label: "Billing Subscription Filters",
      description: "Filters to narrow down billing subscriptions for event triggers.",
    },
    // Emit event when a new invoice is created or imported
    invoiceFilters: {
      type: "string[]",
      label: "Invoice Filters",
      description: "Filters to specify criteria for invoice events.",
    },
    invoiceDateRangeFilters: {
      type: "string[]",
      label: "Invoice Date Range Filters",
      description: "Optional date range filters for invoice events.",
      optional: true,
    },
    // Emit event when a new customer is created
    customerTagsOrMetadataFilters: {
      type: "string[]",
      label: "Customer Tags or Metadata Filters",
      description: "Optional tags or metadata to filter specific types of customers.",
      optional: true,
    },
    // Action: Create a new customer
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer.",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer.",
    },
    customerContactInfo: {
      type: "string",
      label: "Customer Contact Information",
      description: "Contact information for the customer.",
    },
    customerAddress: {
      type: "string",
      label: "Customer Address",
      description: "The address of the customer.",
      optional: true,
    },
    customerMetadata: {
      type: "string",
      label: "Customer Metadata",
      description: "Additional metadata for the customer.",
      optional: true,
    },
    // Action: Create a billing subscription
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer for the subscription.",
    },
    subscriptionPlanId: {
      type: "string",
      label: "Subscription Plan ID",
      description: "The ID of the subscription plan.",
      async options() {
        const plans = await this.listSubscriptionPlans();
        return plans.map((plan) => ({
          label: plan.name,
          value: plan.id,
        }));
      },
    },
    billingFrequency: {
      type: "string",
      label: "Billing Frequency",
      description: "The billing frequency of the subscription.",
      options: [
        {
          label: "Monthly",
          value: "monthly",
        },
        {
          label: "Yearly",
          value: "yearly",
        },
        // Add more frequencies as needed
      ],
    },
    subscriptionDiscounts: {
      type: "string",
      label: "Subscription Discounts",
      description: "Optional discounts for the subscription.",
      optional: true,
    },
    subscriptionCustomNotes: {
      type: "string",
      label: "Subscription Custom Notes",
      description: "Optional custom notes for the subscription.",
      optional: true,
    },
    // Action: Generate a new invoice
    invoiceCustomerId: {
      type: "string",
      label: "Invoice Customer ID",
      description: "The ID of the customer for the invoice.",
    },
    invoiceItems: {
      type: "string[]",
      label: "Invoice Items",
      description: "An array of invoice items as JSON strings.",
      helperText: "Each item should be a valid JSON string representing an invoice item.",
    },
    paymentTerms: {
      type: "string",
      label: "Payment Terms",
      description: "Payment terms for the invoice.",
    },
    invoiceTaxDetails: {
      type: "string",
      label: "Invoice Tax Details",
      description: "Optional tax details for the invoice.",
      optional: true,
    },
    invoiceFooterCustomization: {
      type: "string",
      label: "Invoice Footer Customization",
      description: "Optional footer customization for the invoice.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.pennylane.com/api/external/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    // List billing subscriptions
    async listBillingSubscriptions(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/billing_subscriptions",
        params: opts.params,
      });
    },
    // List invoices
    async listInvoices(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/customer_invoices",
        params: opts.params,
      });
    },
    // List customers
    async listCustomers(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/customers",
        params: opts.params,
      });
    },
    // Create a new customer
    async createCustomer() {
      const data = {
        customer: {
          name: this.customerName,
          email: this.customerEmail,
          contact_information: this.customerContactInfo,
        },
      };
      if (this.customerAddress) {
        data.customer.billing_address = JSON.parse(this.customerAddress);
      }
      if (this.customerMetadata) {
        data.customer.metadata = JSON.parse(this.customerMetadata);
      }
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        data,
      });
    },
    // Create a billing subscription
    async createBillingSubscription() {
      const data = {
        billing_subscription: {
          customer_id: this.customerId,
          subscription_plan_id: this.subscriptionPlanId,
          billing_frequency: this.billingFrequency,
        },
      };
      if (this.subscriptionDiscounts) {
        data.billing_subscription.discounts = JSON.parse(this.subscriptionDiscounts);
      }
      if (this.subscriptionCustomNotes) {
        data.billing_subscription.custom_notes = this.subscriptionCustomNotes;
      }
      return this._makeRequest({
        method: "POST",
        path: "/billing_subscriptions",
        data,
      });
    },
    // Generate a new invoice
    async generateInvoice() {
      const data = {
        invoice: {
          customer_id: this.invoiceCustomerId,
          invoice_items: this.invoiceItems.map((item) => JSON.parse(item)),
          payment_terms: this.paymentTerms,
        },
      };
      if (this.invoiceTaxDetails) {
        data.invoice.tax_details = JSON.parse(this.invoiceTaxDetails);
      }
      if (this.invoiceFooterCustomization) {
        data.invoice.footer_customization = this.invoiceFooterCustomization;
      }
      return this._makeRequest({
        method: "POST",
        path: "/customer_invoices",
        data,
      });
    },
    // List subscription plans
    async listSubscriptionPlans(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/plan_items",
        params: opts.params,
      });
    },
    // Pagination method
    async paginate(fn, ...opts) {
      let results = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await fn({
          ...opts,
          params: {
            page: currentPage,
            ...opts.params,
          },
        });
        if (!response) break;
        let key = "";
        if (response.billing_subscriptions) key = "billing_subscriptions";
        else if (response.invoices) key = "invoices";
        else if (response.customers) key = "customers";
        else break;
        results = results.concat(response[key]);
        totalPages = response.total_pages || response.totalPages || 1;
        currentPage += 1;
      }

      return results;
    },
    // Emit events
    async emitNewBillingSubscription(subscription) {
      // Implementation to emit the billing subscription event
    },
    async emitNewInvoice(invoice) {
      // Implementation to emit the invoice event
    },
    async emitNewCustomer(customer) {
      // Implementation to emit the customer event
    },
  },
  version: "0.0.{{ts}}",
};
