import deftship from "../../deftship.app.mjs";

export default {
  key: "deftship-new-parcel-order-instant",
  name: "New Parcel Order Instant",
  description: "Emit new event when a new parcel order is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    deftship,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    parcelOrderId: {
      propDefinition: [
        deftship,
        "parcelOrderId",
      ],
      optional: true,
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, createdAt,
      } = data;
      return {
        id,
        summary: `New Parcel Order: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
    _getParcelOrder() {
      return this.db.get("parcelOrderId") ?? null;
    },
    _setParcelOrder(parcelOrderId) {
      this.db.set("parcelOrderId", parcelOrderId);
    },
  },
  hooks: {
    async deploy() {
      const parcelOrder = await this.deftship.getParcelOrder({
        parcelOrderId: this.parcelOrderId,
      });
      this._setParcelOrder(parcelOrder.id);
      this.$emit(parcelOrder, {
        id: parcelOrder.id,
        summary: `New parcel order: ${parcelOrder.id}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    let lastRunTime = this.db.get("lastRunTime");
    let results = await this.deftship.getParcelOrder();

    results = results.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return !lastRunTime || createdAt > new Date(lastRunTime);
    });

    for (const result of results) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    }

    lastRunTime = new Date();
    this.db.set("lastRunTime", lastRunTime.toISOString());
  },
};
