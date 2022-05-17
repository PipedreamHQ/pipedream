import gorgias from "../../gorgias.app.mjs";

export default {
  dedupe: "unique",
  props: {
    gorgias,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  methods: {
    getNextCursor() {
      return this.db.get("nextCursor");
    },
    setNextCursor(nextCursor) {
      if (nextCursor) {
        this.db.set("nextCursor", nextCursor);
      }
    },
    getEventTypes() {
      throw new Error("getEventTypes is not implemented");
    },
    async emitEvents(events) {
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          ts: Date.parse(event.created_datetime),
          summary: `New ${event.type} event: ${event.id}`,
        });
      }
    },
  },
  async run() {
    const params = {
      cursor: this.getNextCursor(),
      ...this.getEventTypes(),
    };

    const {
      data: events,
      meta,
    } = await this.gorgias.getEvents(params);

    this.emitEvents(events);
    this.setNextCursor(meta.next_cursor);
  },
};
