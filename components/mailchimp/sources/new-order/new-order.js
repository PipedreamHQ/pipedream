const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "new-order",
  name: "New Order",
  description:
    "Emit new event when an order is added to your store, or Mailchimp account.",
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
        "The unique ID of the store you'd like to watch for new orders. Leave empty to watch for orders on your Mailchimp account.",
    },
    campaignId: {
      propDefinition: [
        common.props.mailchimp,
        "campaignId",
      ],
      description:
        "Watch only for new orders with a specific Campaign Id value.",
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description:
        "Watch only for new orders made by a specific customer with this unique ID.",
      optional: true,
      useQuery: true,
      async options({ page }) {
        const count = 1000;
        const offset = 1000 * page;
        const config = {
          count,
          offset,
        };
        const customersResults =  await this.mailchimp.getAllStoreCustomers(this.storeId, config);
        return customersResults.customers.map((customer) => ({
          label: `${customer.first_name} ${customer.last_name}`,
          value: customer.id,
        }));
      },
    },
    hasOutreach: {
      type: "string",
      label: "Has Outreach?",
      description:
        "Watch only for new orders that have an outreach attached. For example, an email campaign or Facebook ad.",
      options: [
        "Yes",
        "No",
        "Both",
      ],
      default: "Both",
    },
    outreachId: {
      type: "string",
      label: "Outreach Id",
      description:
        "Ignored if `hasOutreach` is marked as 'No'.",
      optional: true,
      useQuery: true,
      async options({ page }) {
        const count = 1000;
        const offset = 1000 * page;
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
      // Emits sample events on the first run during deploy.
      const config = {
        count: 10,
        campaignId: this.campaignId,
        outreachId: this.outreachId,
        customerId: this.customerId,
        hasOutreach: this.hasOutreach,
      };
      const orderStream = this.mailchimp.getOrderStream(this.storeId, config);
      for await (const order of orderStream) {
        this.processEvent(order);
        this.setDbServiceVariable("offset", orderStream.length);
      }
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
  },
  async run() {
      let offset = this.getDbServiceVariable("offset");
      const config = {
        count: 1000,
        offset
      };
      const orderStream = this.mailchimp.getOrderStream(this.storeId, config);
      for await (const order of orderStream) {
        this.processEvent(order);
        this.setDbServiceVariable("offset", orderStream);
      }
    }
  }
}
