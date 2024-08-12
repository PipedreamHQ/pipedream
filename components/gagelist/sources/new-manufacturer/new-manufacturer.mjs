import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-new-manufacturer",
  name: "New Manufacturer Created",
  description: "Emits an event when a new manufacturer is created in GageList",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gagelist: {
      type: "app",
      app: "gagelist",
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
        id, created_at,
      } = data;
      return {
        id,
        summary: `New manufacturer: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.timestamp;
    const manufacturers = await this.gagelist.createManufacturer();
    manufacturers
      .filter((manufacturer) => Date.parse(manufacturer.created_at) > lastRun)
      .forEach((manufacturer) => {
        const meta = this.generateMeta(manufacturer);
        this.$emit(manufacturer, meta);
      });
    this.db.set("lastRun", this.timer.timestamp);
  },
};
