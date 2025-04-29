import tuya from "../../tuya.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "tuya-new-device-activated",
  name: "New Device Activated",
  description: "Emit new event when a device is activated. [See the documentation](https://developer.tuya.com/en/docs/cloud/device-management?id=K9g6rfntdz78a#title-10-Get%20a%20list%20of%20devices%20under%20a%20specified%20user)",
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
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(item) {
      return {
        id: `${item.id}${item.active_time}`,
        summary: `Device Activated with ID: ${item.id}`,
        ts: item.active_time,
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const { result: devices } = this.homeId
      ? await this.tuya.listHomeDevices({
        homeId: this.homeId,
      })
      : await this.tuya.listUserDevices({
        userId: this.userId,
      });

    for (const device of devices) {
      if (device.active_time >= lastTs) {
        const meta = this.generateMeta(device);
        this.$emit(device, meta);
        maxTs = Math.max(device.active_time, maxTs);
      }
    }

    this._setLastTs(maxTs);
  },
};
