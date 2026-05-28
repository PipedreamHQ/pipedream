import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-order",
  name: "New Order",
  description: "Emit new event when an order is added to your store, or Mailchimp account.",
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
      description: "The unique ID of the store you'd like to watch for new orders",
    },
    campaignId: {
      propDefinition: [
        common.props.mailchimp,
        "campaignId",
      ],
      description: "Watch only for new orders with a specific Campaign Id value.",
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "Watch only for new orders made by a specific customer with this unique ID",
      optional: true,
      useQuery: true,
      async options({ page }) {
        const count = constants.PAGE_SIZE;
        const offset = count * page;
        const config = {
          count,
          offset,
        };
        const customersResults =  await this.mailchimp.getAllStoreCustomers(this.storeId, config);
        if (customersResults.customers) {
          return customersResults.customers.map((customer) => ({
            label: `${customer.first_name} ${customer.last_name}`,
            value: customer.id,
          }));
        } else {
          return [];
        }
      },
    },
    hasOutreach: {
      type: "string",
      label: "Has Outreach?",
      description: "Watch only for new orders that have an outreach attached. For example, an email campaign or Facebook ad",
      options: constants.ORDER_HAS_OUTREACH_CHOICES,
      default: "Both",
    },
    outreachId: {
      type: "string",
      label: "Outreach Id",
      description: "Ignored if `hasOutreach` is marked as 'No'",
      optional: true,
      useQuery: true,
      async options({ page }) {
        const count = constants.PAGE_SIZE;
        const offset = count * page;
        const config = {
          count,
          offset,
        };
        const outreachResults =  await this.mailchimp.getAllFacebookAds(config);
        return outreachResults.facebook_ads.map((outreach) => ({
          label: outreach.name,
          value: outreach.id,
        }));
      },
    },
  },
  hooks: {
    async deploy() {
      this._clearProcessedIds();
      const processedIds = new Set(this._getProcessedIds());
      // Emits sample events on the first run during deploy.
      const count = 10;
      const config = {
        count,
        offset: 0,
        campaignId: this.campaignId,
        outreachId: this.outreachId,
        customerId: this.customerId,
        hasOutreach: this.hasOutreach,
      };
      const orderStream = this.mailchimp.getOrderStream(this.storeId, config);
      let i = 0;
      for await (const order of orderStream) {
        if (i < count) {
          this.processEvent(order);
          processedIds.add(order.id);// Mark customer as successfully processed
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
        summary: "A new order has been submitted.",
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
    const config = {
      count: constants.PAGE_SIZE,
      offset: 0,
    };
    const orderStream = this.mailchimp.getOrderStream(this.storeId, config);
    for await (const order of orderStream) {
      if (processedIds.has(order.id)) {
        continue;
      }
      this.processEvent(order);
      processedIds.add(order.id);// Mark order as successfully processed
      this._setProcessedIds(processedIds);
    }
  },
};
