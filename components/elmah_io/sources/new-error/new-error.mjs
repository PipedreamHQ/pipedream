import elmah_io from "../../elmah_io.app.mjs";

export default {
  name: "New Error",
  version: "0.0.1",
  key: "elmah_io-new-error",
  description: "Emit new event on each new error",
  type: "source",
  dedupe: "unique",
  props: {
    elmah_io,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    db: "$.service.db",
    logId: {
      propDefinition: [
        elmah_io,
        "logId",
      ],
    },
  },
  methods: {
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New error with id ${event.id}`,
        ts: Date.parse(event.dateTime),
      });
    },
    _setLastEventDatetime(datetime) {
      this.db.set("lastEventDatetime", datetime);
    },
    _getLastEventDatetime() {
      this.db.get("lastEventDatetime");
    },
  },
  hooks: {
    async deploy() {
      const messages = await this.elmah_io.getMessages({
        logId: this.logId,
        params: {
          pageSize: 10,
        },
      });

      messages.forEach((message) => this.emitEvent(message));
    },
  },
  async run() {
    let page = 1;

    while (page > 0) {
      const messages = await this.elmah_io.getMessages({
        logId: this.logId,
        params: {
          pageIndex: page,
          pageSize: 15,
        },
      });

      messages.forEach((message) => this.emitEvent(message));

      page++;

      if (messages.length < 15) {
        page = -1;
        return;
      }
    }
  },
};
