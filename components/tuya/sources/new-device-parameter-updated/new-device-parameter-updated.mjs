import tuya from "../../tuya.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "tuya-new-device-parameter-updated",
  name: "New Device Parameter Updated",
  description: "Emit new event when the specified device parameter is updated. [See the documentation](https://developer.tuya.com/en/docs/cloud/device-management?id=K9g6rfntdz78a#title-10-Get%20a%20list%20of%20devices%20under%20a%20specified%20user)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    tuya,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    userId: {
      propDefinition: [
        tuya,
        "userId",
      ],
    },
    deviceParameter: {
      type: "string",
      label: "Device Parameter",
      description: "The device parameter to watch for updates. E.g. `switch_1`",
    },
    homeId: {
      propDefinition: [
        tuya,
        "homeId",
        (c) => ({
          userId: c.userId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    _getPreviousValues() {
      return this.db.get("previousValues") || {};
    },
    _setPreviousValues(previousValues) {
      this.db.set("previousValues", previousValues);
    },
    getCurrentValue(device) {
      const { status } = device;
      const relevantStatus = status.find(({ code }) => code === this.deviceParameter);
      return relevantStatus?.value;
    },
    generateMeta(item) {
      const ts = Date.now();
      return {
        id: `${item.id}${ts}`,
        summary: `Device Updated with ID: ${item.id}`,
        ts,
      };
    },
  },
  async run() {
    const previousValues = this._getPreviousValues();
    const newValues = {};

    const { result: devices } = this.homeId
      ? await this.tuya.listHomeDevices({
        homeId: this.homeId,
      })
      : await this.tuya.listUserDevices({
        userId: this.userId,
      });

    for (const device of devices) {
      const currentValue = this.getCurrentValue(device);
      if (previousValues[device.id] !== currentValue) {
        const meta = this.generateMeta(device);
        this.$emit(device, meta);
      }
      newValues[device.id] = currentValue;
    }

    this._setPreviousValues(newValues);
  },
  sampleEmit,
};
