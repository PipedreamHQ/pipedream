import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-customer",
  name: "New Customer",
  description: "Emit new event when a new customer is added to a selected store.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    storeId: {
      propDefinition: [
        common.props.mailchimp,
        "storeId",
      ],
      description: "The unique ID of the store you'd like to watch for new customers",
    },
  },
  hooks: {
    async deploy() {
      this._clearProcessedIds();
      const processedIds = new Set(this._getProcessedIds());
      // Emits sample events on the first run during deploy.
      const pageSize = 10;
      const customerStream = this.mailchimp.getAllStoreCustomers(this.storeId, pageSize);
      let i = 0;
      for await (const customer of customerStream) {
        if (i < pageSize) {
          this.processEvent(customer);
          processedIds.add(customer.id);// Mark customer as successfully processed
          this._setProcessedIds(processedIds);
        }
        i++;
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
    _clearProcessedIds() {
      return this.db.set("processedIds", []);
    },
    _getProcessedIds() {
      return this.db.get("processedIds");
    },
    _setProcessedIds(processedIds) {
      this.db.set("processedIds", Array.from(processedIds));
    },
  },
  async run() {
    const processedIds = new Set(this._getProcessedIds());
    const pageSize = constants.PAGE_SIZE;
    const customerStream = this.mailchimp.getAllStoreCustomers(this.storeId, pageSize);
    for await (const customer of customerStream) {
      if (processedIds.has(customer.id)) {
        continue;
      }
      this.processEvent(customer);
      processedIds.add(customer.id);// Mark customer as successfully processed
      this._setProcessedIds(processedIds);
    }
  },
};
