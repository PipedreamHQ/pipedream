import habitify from "../../habitify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    habitify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getCurrentDateTime() {
      return new Date().toISOString()
        .replace("Z", this.getTimeZoneOffset());
    },
    getTimeZoneOffset() {
      const offset = new Date().getTimezoneOffset();
      const sign = offset > 0
        ? "-"
        : "+";
      const abs = Math.abs(offset);
      const hours = String(Math.floor(abs / 60)).padStart(2, "0");
      const minutes = String(abs % 60).padStart(2, "0");
      return `${sign}${hours}:${minutes}`;
    },
    convertToUTCOffset(dateString) {
      const date = new Date(dateString);
      const iso =
        date.getUTCFullYear() +
        "-" + String(date.getUTCMonth() + 1).padStart(2, "0") +
        "-" + String(date.getUTCDate()).padStart(2, "0") +
        "T" + String(date.getUTCHours()).padStart(2, "0") +
        ":" + String(date.getUTCMinutes()).padStart(2, "0") +
        ":" + String(date.getUTCSeconds()).padStart(2, "0");
      return iso + "+00:00";
    },
  },
};
