import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-new-intent-detection",
  name: "New Intent Detected",
  description: "Emit new event when a specific intent is detected during a conversation. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vapi: {
      type: "app",
      app: "vapi",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    intentToMonitor: {
      propDefinition: [
        vapi,
        "intentToMonitor",
      ],
    },
    filterVoicebotId: {
      propDefinition: [
        vapi,
        "filterVoicebotId",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const lastTs = await this.db.get("last_ts") || new Date(0).toISOString();
      const params = {
        createdAtGt: lastTs,
        limit: 50,
        sortOrder: "ASC",
      };

      if (this.filterVoicebotId && this.filterVoicebotId.length > 0) {
        params.assistantId = this.filterVoicebotId;
      }

      const logs = await this.vapi._makeRequest({
        method: "GET",
        path: "/logs",
        params,
      });

      // Sort logs by time ascending
      const sortedLogs = logs.sort((a, b) => new Date(a.time) - new Date(b.time));
      let emittedCount = 0;

      for (const log of sortedLogs) {
        if (emittedCount >= 50) break;
        const intent = log.requestBody?.intent || log.responseBody?.intent;

        if (intent === this.intentToMonitor) {
          this.$emit(log, {
            id: log.id || log.time,
            summary: `Intent detected: ${this.intentToMonitor}`,
            ts: log.time
              ? Date.parse(log.time)
              : Date.now(),
          });
          emittedCount++;
        }
      }

      // Update last_ts to the latest log's time
      if (logs.length > 0) {
        const latestLog = logs[logs.length - 1];
        await this.db.set(
          "last_ts",
          latestLog.time
            ? new Date(latestLog.time).toISOString()
            : new Date().toISOString(),
        );
      }
    },
    async activate() {
      // No action needed for activate in polling source
    },
    async deactivate() {
      // No action needed for deactivate in polling source
    },
  },
  async run() {
    const lastTs = await this.db.get("last_ts") || new Date(0).toISOString();
    const params = {
      createdAtGt: lastTs,
      limit: 1000,
      sortOrder: "ASC",
    };

    if (this.filterVoicebotId && this.filterVoicebotId.length > 0) {
      params.assistantId = this.filterVoicebotId;
    }

    const logs = await this.vapi._makeRequest({
      method: "GET",
      path: "/logs",
      params,
    });

    for (const log of logs) {
      const intent = log.requestBody?.intent || log.responseBody?.intent;

      if (intent === this.intentToMonitor) {
        const timestamp = log.time
          ? Date.parse(log.time)
          : Date.now();
        this.$emit(log, {
          id: log.id || timestamp,
          summary: `Intent detected: ${this.intentToMonitor}`,
          ts: timestamp,
        });
      }
    }

    // Update last_ts to the latest log's time
    if (logs.length > 0) {
      const latestLog = logs[logs.length - 1];
      await this.db.set(
        "last_ts",
        latestLog.time
          ? new Date(latestLog.time).toISOString()
          : new Date().toISOString(),
      );
    }
  },
};
