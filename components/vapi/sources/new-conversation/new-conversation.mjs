import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import vapi from "../../vapi.app.mjs";

export default {
  key: "vapi-new-conversation",
  name: "New Conversation Started",
  description: "Emits a new event when a voicebot starts a conversation. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vapi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    voicebotIds: {
      propDefinition: [
        vapi,
        "voicebotIds",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const lastRun = Date.now();
      await this.db.set("last_run_ts", lastRun);

      const params = {
        limit: 50,
        sort: "desc",
      };

      if (this.voicebotIds?.length) {
        params.voicebotIds = this.voicebotIds.join(",");
      }

      const conversations = await this.vapi._makeRequest({
        method: "GET",
        path: "/conversation",
        params,
      });

      conversations.reverse().forEach((convo) => {
        this.$emit(convo, {
          id: convo.id || convo.ts,
          summary: `New Conversation: ${convo.id}`,
          ts: convo.createdAt
            ? Date.parse(convo.createdAt)
            : lastRun,
        });
      });
    },
    async activate() {
      // No webhook subscription needed for polling
    },
    async deactivate() {
      // No webhook subscription to remove
    },
  },
  async run() {
    const lastRun = (await this.db.get("last_run_ts")) || Date.now();
    let newLastRun = lastRun;

    const params = {
      createdAt_gt: lastRun,
      limit: 100,
      sort: "asc",
    };

    if (this.voicebotIds?.length) {
      params.voicebotIds = this.voicebotIds.join(",");
    }

    const conversations = await this.vapi._makeRequest({
      method: "GET",
      path: "/conversation",
      params,
    });

    for (const convo of conversations) {
      this.$emit(convo, {
        id: convo.id || convo.ts,
        summary: `New Conversation: ${convo.id}`,
        ts: convo.createdAt
          ? Date.parse(convo.createdAt)
          : Date.now(),
      });

      if (convo.createdAt) {
        const convoTs = Date.parse(convo.createdAt);
        if (convoTs > newLastRun) {
          newLastRun = convoTs;
        }
      } else {
        if (Date.now() > newLastRun) {
          newLastRun = Date.now();
        }
      }
    }

    await this.db.set("last_run_ts", newLastRun);
  },
};
