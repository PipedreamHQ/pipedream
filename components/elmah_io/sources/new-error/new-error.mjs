import elmah_io from "../../elmah_io.app.mjs";
import constants from "../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const QUERY = "severity:Error OR severity:Fatal";

export default {
  name: "New Error",
  version: "0.0.4",
  key: "elmah_io-new-error",
  description: "Emit new event on each new error. [See the documentation](https://api.elmah.io/swagger/index.html#/Messages/Messages_GetAll)",
  type: "source",
  dedupe: "unique",
  props: {
    elmah_io,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    logId: {
      propDefinition: [
        elmah_io,
        "logId",
      ],
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "Note: This source requires that your api key have the `logs_read` and `messages_read` permissions.",
    },
  },
  methods: {
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New error with ID ${event.id}`,
        ts: Date.parse(event.dateTime),
      });
    },
    _setLastEventDatetime(datetime) {
      this.db.set("lastEventDatetime", datetime);
    },
    _getLastEventDatetime() {
      return this.db.get("lastEventDatetime");
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

      if (!messages.length) {
        return;
      }

      messages.forEach(this.emitEvent);
      this._setLastEventDatetime(messages[0].dateTime);
    },
  },
  async run() {
    let page = 0;
    const lastEventDatetime = this._getLastEventDatetime();

    while (page >= 0) {
      const messages = await this.elmah_io.getMessages({
        logId: this.logId,
        params: {
          pageIndex: page,
          pageSize: constants.DEFAULT_PAGE_SIZE,
          query: QUERY,
          from: lastEventDatetime
            ? lastEventDatetime
            : undefined,
        },
      });

      if (!messages.length) {
        return;
      }

      messages.forEach(this.emitEvent);
      this._setLastEventDatetime(messages[0].dateTime);

      page++;

      if (messages.length < constants.DEFAULT_PAGE_SIZE) {
        page = -1;
        return;
      }
    }
  },
};
