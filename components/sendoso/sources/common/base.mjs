import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sendoso from "../../sendoso.app.mjs";

export default {
  props: {
    sendoso,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Sendoso API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(data) {
      const field = this.getFieldId();
      data.forEach((item) => {
        this._setLastId(item[field]);
        this.$emit(item, this.getDataToEmit(item));
      });
    },
  },
  hooks: {
    async activate() {
      await this.startRun();
    },
  },
  async run() {
    await this.proccessEvent();
  },
};

