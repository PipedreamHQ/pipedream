import gorgias from "../../gorgias.app.mjs";

export default {
  key: "gorgias-new-events",
  name: "New Events",
  description: "Emit new Gorgias event",
  version: "0.1.0",
  type: "source",
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
    _getNextCursor() {
      return this.db.get("nextCursor");
    },
    _setNextCursor(nextCursor) {
      if (nextCursor) {
        this.db.set("nextCursor", nextCursor);
      }
    },
    async emitEvents(events) {
      for (const event of events) {
        this.$emit(event, {
          id: event.id,
          ts: Date.parse(event.created_datetime),
          summary: event.type,
        });
      }
    },
    async getEvents(params) {
      const {
        data: events,
        meta,
      } = await this.gorgias.getEvents(params);
      this.emitEvents(events);
      this._setNextCursor(meta.next_cursor);
    },
  },
  async run() {
    const cursor = this._getNextCursor();
    const params = {
      cursor,
    };

    if (!cursor) {
      params.limit = 10;
    }

    await this.getEvents(params);
  },
};
