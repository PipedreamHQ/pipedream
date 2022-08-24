import monday from "../../monday.app.mjs";

export default {
  props: {
    monday,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Monday API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // every 15 minutes
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
