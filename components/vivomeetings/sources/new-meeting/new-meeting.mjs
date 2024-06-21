import vivomeetings from "../../vivomeetings.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivomeetings-new-meeting",
  name: "New VivoMeeting or Webinar Created",
  description: "Emit new event when a new VivoMeeting or webinar is created. [See the documentation](https://vivomeetings.com/api-developer-guide/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vivomeetings,
    authorization: {
      propDefinition: [
        vivomeetings,
        "authorization",
      ],
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
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    async fetchNewEvents() {
      const lastTimestamp = this._getLastTimestamp();
      const response = await axios(this, {
        method: "GET",
        url: `${this.vivomeetings._baseUrl()}/meetings`,
        headers: {
          Authorization: `Bearer ${this.authorization}`,
        },
        params: {
          since: lastTimestamp,
        },
      });
      return response.meetings || [];
    },
  },
  hooks: {
    async deploy() {
      const events = await this.fetchNewEvents();
      events.slice(0, 50).forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `New Meeting: ${event.title}`,
          ts: new Date(event.start_time).getTime(),
        });
      });
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        this._setLastTimestamp(new Date(lastEvent.start_time).getTime());
      }
    },
    async activate() {
      // Implement activation logic if needed (e.g., webhook subscription)
    },
    async deactivate() {
      // Implement deactivation logic if needed (e.g., remove webhook subscription)
    },
  },
  async run() {
    const events = await this.fetchNewEvents();
    events.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        summary: `New Meeting: ${event.title}`,
        ts: new Date(event.start_time).getTime(),
      });
    });
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      this._setLastTimestamp(new Date(lastEvent.start_time).getTime());
    }
  },
};
