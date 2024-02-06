import commonSources from "../../common/sources.mjs";

export default {
  ...commonSources,
  type: "source",
  key: "wave-new-customer",
  name: "New Customer",
  version: "0.0.1",
  description: "Emit new event when an customer is created.",
  methods: {
    ...commonSources.methods,
    emitEvent(customer) {
      this.$emit(customer, {
        id: customer.id,
        summary: `${customer.name} <${customer.email ?? "<empty-email>"}>`,
        ts: customer.createdAt,
      });
    },
  },
  async run() {
    let page = 1;
    const eventsToEmit = [];
    const lastEventId = this.getLastEventId();

    loop1:
    while (true) {
      const res = await this.app.listCustomersByBusiness(
        this.businessId,
        page,
      );

      for (const customer of res.data.business.customers.edges) {
        // If we've already seen this customer (based on event ID), break out of the loop.
        if (lastEventId && customer.node.id === lastEventId) {
          break loop1;
        }
        eventsToEmit.unshift(customer);
      }

      const {
        currentPage,
        totalPages,
      } = res.data.business.customers.pageInfo;
      if (currentPage === totalPages) {
        break;
      }

      page++;
    }
    for (const customer of eventsToEmit) {
      this.emitEvent(customer.node);
    }

    if (eventsToEmit.length > 0) {
      this.setLastEventId(eventsToEmit[eventsToEmit.length - 1].node.id);
    }
  },
};
