import deftship from "../../deftship.app.mjs";

export default {
  key: "deftship-new-freight-order-instant",
  name: "New Freight Order Instant",
  description: "Emit new event when a new freight order is created in Deftship",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    deftship,
    freightOrderId: {
      propDefinition: [
        deftship,
        "freightOrderId",
      ],
    },
    dataFields: {
      type: "string[]",
      label: "Data Fields",
      description: "Specific data fields from the freight order",
      optional: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, createdAt,
      } = data;
      return {
        id,
        summary: `New Freight Order: ${id}`,
        ts: Date.parse(createdAt),
      };
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.timestamp;
    const freightOrder = await this.deftship.getFreightOrder({
      freightOrderId: this.freightOrderId,
    });
    if (Date.parse(freightOrder.createdAt) > lastRunTime) {
      const data = this.dataFields
        ? this.dataFields.reduce((acc, field) => ({
          ...acc,
          [field]: freightOrder[field],
        }), {})
        : freightOrder;
      const meta = this.generateMeta(freightOrder);
      this.$emit(data, meta);
    }
    this.db.set("lastRunTime", this.timer.timestamp);
  },
};
