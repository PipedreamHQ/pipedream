import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import meetingpulse from "../meetingpulse.app.mjs";

export default {
  props: {
    meetingpulse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    meetingId: {
      propDefinition: [
        meetingpulse,
        "meetingId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData(false);
    },
  },
  methods: {
    _getSavedValue() {
      return this.db.get("savedValue") ?? [];
    },
    _setSavedValue(value) {
      this.db.set("savedValue", value);
    },
  },
  async run() {
    await this.getAndProcessData(true);
  },
};
