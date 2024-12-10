import chargebee from "chargebee";

export default {
  type: "app",
  app: "chargebee",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer to create the subscription for.",
      async options() {
        const customers = await this.getCustomers();
        return customers.list.map((customer) => ({
          label: `${customer.first_name ?? ''} ${customer.last_name ?? ''} (${customer.email ?? customer.id})`,
          value: customer.id,
        }));
      }
    }
  },
  methods: {
    instance() {
      chargebee.configure({
        site: this.$auth.sub_url,
        api_key: this.$auth.api_key,
      });
      return chargebee;
    },
    getSubscriptions(args = {}) {
      return this.instance().subscription.list(args).request();
    },
    getTransactions(args = {}) {
      return this.instance().transaction.list(args).request();
    },
    getCustomers(args = {}) {
      return this.instance().customer.list(args).request();
    },
    getInvoices(args = {}) {
      return this.instance().invoice.list(args).request();
    },
    getPaymentSources(args = {}) {
      return this.instance().payment_source.list(args).request();
    },
    getEvents(args = {}) {
      return this.instance().event.list(args).request();
    },
    createCustomer(args = {}) {
      return this.instance().customer.create(args).request();
    },
    createSubscription(customerId, args = {}) {
      return this.instance().subscription.create_for_customer(customerId, args).request();
    },
  },
};
