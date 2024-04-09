import lastpass from "../../lastpass.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "lastpass-new-watch-events",
  name: "New Watch Events",
  description: "Emit new event when a new event is generated in LastPass",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lastpass,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    username: {
      propDefinition: [
        lastpass,
        "username",
      ],
      description: "To pull data for a specific user, enter their username. To pull data for all users, enter 'allusers'.",
      default: "allusers",
      optional: true,
    },
    admin: {
      type: "boolean",
      label: "Admin Events Only",
      description: "To retrieve only admin events, set this value to `true`",
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || this.oneDayAgo();
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    oneDayAgo() {
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        .split(".")[0] + "+00:00";
    },
    generateMeta(event) {
      return {
        id: `${event.Username}${event.Time}`,
        summary: `New Event: ${event.Action}`,
        ts: Date.parse(event.Time),
      };
    },
  },
  async run() {
    const lastDate = this._getLastDate();
    let maxDate = lastDate;
    const { data } = await this.lastpass.getEvents({
      data: {
        user: this.username,
        admin: this.admin,
        from: lastDate,
      },
    });
    for (const key in data) {
      const event = data[key];
      if (Date.parse(event.Time) > Date.parse(maxDate)) {
        maxDate = event.Time;
      }
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    }
    this._setLastDate(maxDate);
  },
  sampleEmit,
};
