import elmah_io from "../../elmah_io.app.mjs";
import constants from "../common/constants.mjs";

const QUERY = "isNew:true AND (severity:Error OR severity:Fatal)";

export default {
  name: "New Error",
  version: "0.0.2",
  key: "elmah_io-new-error",
  description: "Emit new event on each new error",
  type: "source",
  dedupe: "unique",
  props: {
    elmah_io,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
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
          query: QUERY,
        },
      });

      messages.forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;

    while (page >= 0) {
      const messages = await this.elmah_io.getMessages({
        logId: this.logId,
        params: {
          pageIndex: page,
          pageSize: constants.DEFAULT_PAGE_SIZE,
          query: QUERY,
        },
      });

      messages.forEach(this.emitEvent);

      page++;

      if (messages.length < constants.DEFAULT_PAGE_SIZE) {
        page = -1;
        return;
      }
    }
  },
};
