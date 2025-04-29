import Chargebee from "chargebee";

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
        return customers.list.map(({ customer }) => ({
          label: `${customer.first_name ?? ""} ${customer.last_name ?? ""} (${customer.email ?? customer.id})`,
          value: customer.id,
        }));
      },
    },
    itemPriceId: {
      type: "string",
      label: "Plan Item Price ID",
      description: "The unique identifier of the plan item price.",
      async options() {
        const itemPrices = await this.getItemPrices();
        return itemPrices.list
          .filter(({ item_price: { item_type } }) => item_type === "plan")
          .map(({
            item_price: {
              name, id,
            },
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
  },
  methods: {
    instance() {
      return new Chargebee({
        site: this.$auth.sub_url,
        apiKey: this.$auth.api_key,
      });
    },
    getSubscriptions(args = {}) {
      return this.instance().subscription.list(args);
    },
    getTransactions(args = {}) {
      return this.instance().transaction.list(args);
    },
    getCustomers(args = {}) {
      return this.instance().customer.list(args);
    },
    getInvoices(args = {}) {
      return this.instance().invoice.list(args);
    },
    getPaymentSources(args = {}) {
      return this.instance().paymentSource.list(args);
    },
    getEvents(args = {}) {
      return this.instance().event.list(args);
    },
    createCustomer(args = {}) {
      return this.instance().customer.create(args);
    },
    createSubscription(customerId, args = {}) {
      return this.instance().subscription.createWithItems(customerId, args);
    },
    getItemPrices(args = {}) {
      return this.instance().itemPrice.list(args);
    },
  },
};
