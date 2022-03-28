const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "new-customer",
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
    deactivate() {
      this._clearProcessedIds();
    },
    async deploy() {
      this._clearProcessedIds();
      const processedIds = new Set(this._getProcessedIds());
      // Emits sample events on the first run during deploy.
      const pageSize = 10;
      const customerStream =
        await this.mailchimp.getAllStoreCustomers(this.storeId, pageSize);
        for await (const customer of customerStream) {
          this.processEvent(customer);
        // Mark customer as successfully processed
        processedIds.add(customer.id);
        this._setProcessedIds(processedIds);
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: `New customer "${eventPayload.first_name} ${eventPayload.last_name}" was added to your store. `,
        ts,
      };
    },
    _getProcessedIds(){
      return this.db.set("processedIds");
    },
    _setProcessedIds(processedIds){
      this.db.set("processedIds", Array.from(processedIds));
    }
  },
  async run() {
    const processedIds = new Set(this._getProcessedIds());
    const pageSize = 1000;
    const customerStream = this.mailchimp.getAllStoreCustomers(this.storeId, pageSize);
    for await (const customer of customerStream) {
      if (processedIds.has(customer.id)) {
        continue;
      }
        this.processEvent(customer);
      // Mark customer as successfully processed
      processedIds.add(customer.id); //TODO: implement _markCustomerAsProcessed and use processedIds
      this._setProcessedIds(processedIds);
    }
  },
};
