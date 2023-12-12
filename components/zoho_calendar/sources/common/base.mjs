import app from "../../zoho_calendar.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    calendarId: {
      propDefinition: [
        app,
        "calendarId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    getLastModified() {
      return this.db.get("lastModified");
    },
    setLastModified(lastModified) {
      this.db.set("lastModified", lastModified);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    convertToMs(date) {
      const pattern = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/;
      return +new Date(date.replace(pattern, "$1-$2-$3T$4:$5:$6Z"));
    },
  },
};
