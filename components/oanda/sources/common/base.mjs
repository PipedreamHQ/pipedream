import oanda from "../../oanda.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    oanda,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    isDemo: {
      propDefinition: [
        oanda,
        "isDemo",
      ],
    },
    accountId: {
      propDefinition: [
        oanda,
        "accountId",
        (c) => ({
          isDemo: c.isDemo,
        }),
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 1;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitItem(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    processEvent() {
      throw new Error("processEvent is not iplemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
