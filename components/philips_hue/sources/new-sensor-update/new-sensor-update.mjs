import common from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "philips_hue-new-sensor-update",
  name: "New Sensor Update",
  description: "Emit new event when a linked Hue sensor (e.g., motion, temperature, or ambient light) sends an update. [See the documentation](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    motionId: {
      propDefinition: [
        common.props.philipsHue,
        "motionId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
    temperatureId: {
      propDefinition: [
        common.props.philipsHue,
        "temperatureId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
    lightLevelId: {
      propDefinition: [
        common.props.philipsHue,
        "lightLevelId",
        (c) => ({
          username: c.username,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    deploy() {
      const definedCount = [
        this.motionId,
        this.temperatureId,
        this.lightLevelId,
      ].filter((x) => x !== undefined).length;
      if (definedCount !== 1) {
        throw new ConfigurationError("Must specify exactly one of Motion Sensor ID, Temperature Sensor ID or Light Level Sensor ID");
      }
    },
  },
  methods: {
    ...common.methods,
    getSummary(item) {
      const sensorType = this.motionId
        ? "Motion"
        : this.temperatureId
          ? "Temperature"
          : "Light level";
      return `${sensorType} Sensor Updated with ID: ${item.id}`;
    },
  },
  async run() {
    const previousData = this._getPreviousData();
    const args = {
      username: this.username,
    };
    const { data } = this.motionId
      ? await this.philipsHue.getMotionSensor({
        ...args,
        motionId: this.motionId,
      })
      : this.temperatureId
        ? await this.philipsHue.getTemperatureSensor({
          ...args,
          temperatureId: this.temperatureId,
        })
        : await this.philipsHue.getLightLevelSensor({
          ...args,
          lightLevelId: this.lightLevelId,
        });

    for (const item of data) {
      const changed = this.motionId
        ? item.motion.motion_report.changed
        : this.temperatureId
          ? item.temperature.temperature_report.changed
          : item.light.light_level_report.changed;
      if (previousData[item.id] && previousData[item.id] <= Date.parse(changed)) {
        continue;
      }

      this.emitEvent(item);

      previousData[item.id] = Date.parse(changed);
    }

    this._setPreviousData(previousData);
  },
};
