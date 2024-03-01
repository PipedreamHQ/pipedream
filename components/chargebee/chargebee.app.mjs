import chargebee from "chargebee";

export default {
  type: "app",
  app: "chargebee",
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
  },
};
