import timing from "../../timing.app.mjs";

export default {
  key: "timing-new-timer-started-running",
  name: "New Timer Started Running",
  description: "Emit new event each time a new timer is started",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    timing,
    userCredentials: {
      propDefinition: [
        timing,
        "userCredentials",
      ],
    },
    timerInfo: {
      propDefinition: [
        timing,
        "timerInfo",
      ],
    },
    db: "$.service.db",
  },
  methods: {
    ...timing.methods,
    _getTimer() {
      return this.db.get("timer") || null;
    },
    _setTimer(id) {
      this.db.set("timer", id);
    },
  },
  async run() {
    const {
      userCredentials, timerInfo,
    } = this;
    const newTimer = await this.timing.startNewTimer({
      userCredentials,
      timerInfo,
    });
    const currentTimer = this._getTimer();

    if (currentTimer !== newTimer.self) {
      this._setTimer(newTimer.self);
      this.$emit(newTimer, {
        id: newTimer.self,
        summary: `New timer started: ${newTimer.self}`,
        ts: Date.now(),
      });
    }
  },
};
