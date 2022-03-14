const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-new-customer",
  name: "New Customer",
  description:
    "Emit new event when a new customer is added to a selected store.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    storeId: {
      propDefinition: [
        common.props.mailchimp,
        "storeId",
      ],
      description:
      "The unique ID of the store you'd like to watch for new customers.",
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const config = {
        count: 10,
        offset: 0,
      };
      const mailchimpStoreCustomersInfo =
        await this.mailchimp.getAllStoreCustomers(this.storeId, config);
      const { customers: mailchimpStoreCustomers = [] } =
        mailchimpStoreCustomersInfo;
      if (!mailchimpStoreCustomers.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpStoreCustomers.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: `New customer "${eventPayload.first_name} ${eventPayload.last_name}" was added to your store. `,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    const processedIds = new Set(this._getProcessedIds());
    const pageSize = 1000;
    const customerStream = this.mailchimp.getAllStoreCustomers(this.storeId, pageSize);    
    for await (const customer of customerStream) {
      if (processedIds.has(customer.id)) {
        continue;
      }
        this.emitEvent(customer);
      // Mark customer as successfully processed
      processedIds.add(customer.id); //TODO: implement _markCustomerAsProcessed and use processedIds
      this._markCustomerAsProcessed(customer);
    }
  },
};