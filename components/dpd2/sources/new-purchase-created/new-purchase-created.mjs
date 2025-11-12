import dpd2 from "../../dpd2.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "dpd2-new-purchase-created",
  name: "New Purchase Created",
  description: "Emit new event when a purchase is made. [See the documentation](https://getdpd.com/docs/api/purchases.html#list-purchases)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    dpd2,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    storefrontId: {
      propDefinition: [
        dpd2,
        "storefrontId",
      ],
    },
    productId: {
      propDefinition: [
        dpd2,
        "productId",
        (c) => ({
          storefrontId: c.storefrontId,
        }),
      ],
    },
    customerId: {
      propDefinition: [
        dpd2,
        "customerId",
      ],
    },
    subscriberId: {
      propDefinition: [
        dpd2,
        "subscriberId",
        (c) => ({
          storefrontId: c.storefrontId,
        }),
      ],
    },
    status: {
      propDefinition: [
        dpd2,
        "status",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    emitEvent(purchase) {
      const meta = this.generateMeta(purchase);
      this.$emit(purchase, meta);
    },
    generateMeta(purchase) {
      return {
        id: purchase.id,
        summary: `New Purchase: ${purchase.id}`,
        ts: purchase.created_at,
      };
    },
    async processEvent(max) {
      const lastCreated = this._getLastCreated();
      let purchases = await this.dpd2.listPurchases({
        params: {
          date_min: lastCreated,
          status: this.status,
          product_id: this.productId,
          storefrontId: this.storefrontId,
          customer_id: this.customerId,
          subscriber_id: this.subscriberId,
        },
      });
      if (!purchases?.length) {
        return;
      }
      this._setLastCreated(purchases[purchases.length - 1].created_at);
      if (max) {
        purchases = purchases.slice(max * -1);
      }
      purchases.forEach((purchase) => this.emitEvent(purchase));
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
