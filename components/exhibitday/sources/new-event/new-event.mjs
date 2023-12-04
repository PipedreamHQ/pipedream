import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-new-event",
  name: "New Event",
  description: "Emit new event when an event is created in ExhibitDay",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    exhibitday,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // by default, run every 15 minutes
      },
    },
  },
  methods: {
    _getEventId(event) {
      return event.id;
    },
  },
  hooks: {
    async deploy() {
      const events = await this.exhibitday.getNewEvent();
      if (events.length > 0) {
        const mostRecentEvent = events[0];
        this.db.set("lastEventId", this._getEventId(mostRecentEvent));
      }
    },
  },
  async run() {
    const events = await this.exhibitday.getNewEvent();
    for (const event of events) {
      const eventId = this._getEventId(event);
      const lastEventId = this.db.get("lastEventId");
      if (eventId !== lastEventId) {
        this.$emit(event, {
          id: eventId,
          summary: event.name,
          ts: Date.parse(event.date),
        });
      } else {
        break;
      }
    }
    this.db.set("lastEventId", this._getEventId(events[0]));
  },
};
