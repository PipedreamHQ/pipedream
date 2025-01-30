import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-new-message",
  name: "New Message",
  description: "Emit new events when a voicebot sends or receives a message during a conversation. [See the documentation]()",
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
    voicebotIds: {
      propDefinition: [
        "vapi",
        "voicebotIds",
      ],
    },
    conversationId: {
      propDefinition: [
        "vapi",
        "conversationId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const lastTs = (await this.db.get("lastTs")) || 0;
      const params = {
        type: "APIWebhookCallProvider",
        webhookType: "message",
        sortOrder: "DESC",
        limit: 50,
      };
      if (this.voicebotIds) {
        params.assistantId = this.voicebotIds;
      }
      if (this.conversationId) {
        params.callId = this.conversationId;
      }
      const logs = await this.vapi._makeRequest({
        method: "GET",
        path: "/logs",
        params,
      });
      const sortedLogs = logs.results.sort((a, b) => new Date(a.time) - new Date(b.time));
      for (const log of sortedLogs) {
        const ts = Date.parse(log.time) || Date.now();
        const id = log.assistantId
          ? log.assistantId
          : ts;
        const summary = `New message from assistant ${log.assistantId || "Unknown"}`;
        this.$emit(log, {
          id,
          summary,
          ts,
        });
      }
      const latestTs = logs.results.length > 0
        ? Date.parse(logs.results[0].time)
        : lastTs;
      await this.db.set("lastTs", latestTs);
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to remove
    },
  },
  async run() {
    const lastTs = (await this.db.get("lastTs")) || 0;
    const params = {
      type: "APIWebhookCallProvider",
      webhookType: "message",
      sortOrder: "DESC",
      limit: 100,
      createdAtGt: new Date(lastTs).toISOString(),
    };
    if (this.voicebotIds) {
      params.assistantId = this.voicebotIds;
    }
    if (this.conversationId) {
      params.callId = this.conversationId;
    }
    const logs = await this.vapi._makeRequest({
      method: "GET",
      path: "/logs",
      params,
    });
    const sortedLogs = logs.results.sort((a, b) => new Date(a.time) - new Date(b.time));
    for (const log of sortedLogs) {
      const ts = Date.parse(log.time) || Date.now();
      const id = log.assistantId
        ? log.assistantId
        : ts;
      const summary = `New message from assistant ${log.assistantId || "Unknown"}`;
      this.$emit(log, {
        id,
        summary,
        ts,
      });
    }
    if (logs.results.length > 0) {
      const latestTs = Date.parse(logs.results[0].time);
      await this.db.set("lastTs", latestTs);
    }
  },
};
