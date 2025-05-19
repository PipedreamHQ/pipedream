import { axios } from "@pipedream/platform";
import browserbase from "../../browserbase.app.mjs";

export default {
  key: "browserbase-new-session-log",
  name: "New Session Log",
  description: "Emit new event when a specific session has a new log. [See the documentation](https://docs.browserbase.com/reference/api/session-logs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    browserbase,
    sessionId: {
      propDefinition: [
        browserbase,
        "sessionId",
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
    _getLastLogId() {
      return this.db.get("lastLogId") || null;
    },
    _setLastLogId(logId) {
      this.db.set("lastLogId", logId);
    },
    async checkForNewLogs() {
      const logs = await this.browserbase.getSessionLogs({
        sessionId: this.sessionId,
      });

      const lastLogId = this._getLastLogId();
      for (const log of logs) {
        if (lastLogId && log.id <= lastLogId) break;

        this.$emit(log, {
          id: log.id,
          summary: `Log for session: ${this.sessionId}`,
          ts: log.timestamp || Date.now(),
        });
      }

      if (logs.length > 0) {
        this._setLastLogId(logs[0].id);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.checkForNewLogs();
    },
    async activate() {
      // Add any subscription or initialization logic as needed.
    },
    async deactivate() {
      // Add any subscription deletion or cleanup logic as needed.
    },
  },
  async run() {
    await this.checkForNewLogs();
  },
};
