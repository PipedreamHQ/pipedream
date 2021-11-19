const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-new-order",
  name: "New Order",
  description:
    "Emit new event when an order is added to your store, or Mailchimp account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    storeId: {
      type: "string",
      label: "Store Id",
      description:
        "The unique ID of the store you'd like to watch for new orders. Leave empty to watch for orders on your Mailchimp account.",
      optional: true,
    },
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description:
        "Watch only for new orders with a specific Campaign Id value.",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description:
        "Watch only for new orders made by a specific customer with this unique ID.",
      optional: true,
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
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const mailchimpOrdersInfo = await this.mailchimp.getAllOrders(
        this.storeId,
        10,
        0,
        this.campaignId,
        this.outreachId,
        this.customerId,
        this.hasOutreach,
      );
      console.log(this.hasOutreach);
      const { orders: mailchimpOrders = [] } = mailchimpOrdersInfo;
      if (!mailchimpOrders.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpOrders.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.created_at);
      return {
        id: eventPayload.id,
        summary: "A new order has been submitted.",
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    let mailchimpOrdersInfo;
    let mailchimpOrders;
    let offset = 0;
    do {
      mailchimpOrdersInfo = await this.mailchimp.getAllOrders(
        this.storeId,
        1000,
        offset,
        this.campaignId,
        this.outreachId,
        this.customerId,
        this.hasOutreach,
      );
      mailchimpOrders = mailchimpOrdersInfo.orders;
      if (!mailchimpOrders.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpOrders.forEach(this.processEvent);
      offset = offset + mailchimpOrders.length;
    } while (mailchimpOrders.length > 0);
  },
};
