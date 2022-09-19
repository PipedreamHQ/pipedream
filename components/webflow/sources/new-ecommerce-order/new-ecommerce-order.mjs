import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-ecommerce-order",
  name: "New E-commerce Order",
  description: "Emit new event when an e-commerce order is created. [See the docs here](https://developers.webflow.com/#order-model)",
  version: "0.2.0",
  ...common,
  props: {
    ...common.props,
    historicalEventsNumber: {
      type: "integer",
      label: "Number of Historical Events to Emit",
      description: "Defaults to `0`. Number of historical events to fetch and emit. Maximum is `100`.",
      optional: true,
      default: 0,
      min: 0,
      max: 100,
    },
    emitMostRecent: {
      type: "boolean",
      label: "Emit Most Recent Events",
      description: "Defaults to `false`. **Warning**: if `true`, will need to request all orders to extract the most recent ones.",
      default: false,
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      if (!this.historicalEventsNumber) {
        return;
      }

      const path = `/sites/${this.siteId}/orders`;
      console.log("Retrieving historical events...");

      if (!this.emitMostRecent) {
        const events = await this._makeRequest(path, {
          limit: this.historicalEventsNumber,
        });
        this.emitHistoricalEvents(events);
        return;
      }

      let toEmit = [];
      let events = [];
      const params = {
        offset: 0,
      };

      do {
        events = await this._makeRequest(path, params);

        if (toEmit.push(...events) > 100) {
          toEmit = toEmit.slice(toEmit.length - 100, toEmit.length);
        }

        params.offset += 1;
      } while (events.length > 0);

      toEmit.reverse();
      this.emitHistoricalEvents(toEmit, this.historicalEventsNumber);
    },
  },
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_new_order";
    },
    generateMeta(data) {
      return {
        id: data.orderId,
        summary: `New ${data.orderId} e-commerce order`,
        ts: Date.parse(data.acceptedOn),
      };
    },
  },
};
