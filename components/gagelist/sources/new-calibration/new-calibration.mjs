import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-new-calibration",
  name: "New Calibration Created",
  description: "Emit new event when a new calibration is created.",
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
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastCalibrationId() {
      return this.db.get("lastCalibrationId") || 0;
    },
    _setLastCalibrationId(id) {
      this.db.set("lastCalibrationId", id);
    },
  },
  async run() {
    const lastCalibrationId = this._getLastCalibrationId();
    const { data: calibrations } = await this.gagelist.createCalibration();
    calibrations.forEach((calibration) => {
      if (calibration.id > lastCalibrationId) {
        this.$emit(calibration, {
          id: calibration.id,
          summary: `New calibration: ${calibration.id}`,
          ts: Date.now(),
        });
        this._setLastCalibrationId(calibration.id);
      }
    });
  },
};
