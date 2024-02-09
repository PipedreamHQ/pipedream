import qualetics from "../../qualetics.app.mjs";

export default {
  key: "qualetics-new-event",
  name: "New Event",
  description: "Emit new event when a new event is created in the system",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    qualetics,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created,
      } = data;
      return {
        id,
        summary: `New event: ${id}`,
        ts: Date.parse(created),
      };
    },
  },
  async run() {
    const lastEventId = this.db.get("lastEventId");
    const { data: events } = await this.qualetics._makeRequest({
      path: "/events",
    });

    const newEvents = events.filter((event) => event.id > lastEventId);

    for (const event of newEvents) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    }

    if (newEvents.length > 0) {
      this.db.set("lastEventId", newEvents[newEvents.length - 1].id);
    }
  },
};
