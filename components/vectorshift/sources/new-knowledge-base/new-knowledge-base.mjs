import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import vectorshift from "../../vectorshift.app.mjs";

export default {
  key: "vectorshift-new-knowledge-base",
  name: "New Knowledge Base Created",
  description: "Emit new event when a knowledge base is created in Vectorshift. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vectorshift: {
      type: "app",
      app: "vectorshift",
    },
    db: {
      type: "$.service.db",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      try {
        const knowledgeBases = await this.vectorshift.listKnowledgeBases();
        if (!knowledgeBases || knowledgeBases.length === 0) return;

        const sortedKnowledgeBases = knowledgeBases
          .sort((a, b) => {
            const aTs = a.created_at
              ? Date.parse(a.created_at)
              : 0;
            const bTs = b.created_at
              ? Date.parse(b.created_at)
              : 0;
            return bTs - aTs;
          })
          .slice(0, 50);

        for (const kb of sortedKnowledgeBases.reverse()) {
          this.$emit(
            kb,
            {
              id: kb.id || Date.parse(kb.created_at) || Date.now(),
              summary: `New Knowledge Base: ${kb.name}`,
              ts: kb.created_at
                ? Date.parse(kb.created_at)
                : Date.now(),
            },
          );
        }

        const latestTimestamp = sortedKnowledgeBases.reduce((max, kb) => {
          const kbTs = kb.created_at
            ? Date.parse(kb.created_at)
            : 0;
          return kbTs > max
            ? kbTs
            : max;
        }, 0);

        await this.db.set("lastEmitTimestamp", latestTimestamp);
      } catch (error) {
        console.error("Error during deploy hook:", error);
      }
    },
    async activate() {
      // No webhook subscription necessary for polling source
    },
    async deactivate() {
      // No webhook subscription to remove for polling source
    },
  },
  async run() {
    try {
      const lastTimestamp = (await this.db.get("lastEmitTimestamp")) || 0;
      const knowledgeBases = await this.vectorshift.listKnowledgeBases();
      if (!knowledgeBases || knowledgeBases.length === 0) return;

      const newKnowledgeBases = knowledgeBases
        .filter((kb) => {
          const kbTs = kb.created_at
            ? Date.parse(kb.created_at)
            : 0;
          return kbTs > lastTimestamp;
        })
        .sort((a, b) => {
          const aTs = a.created_at
            ? Date.parse(a.created_at)
            : 0;
          const bTs = b.created_at
            ? Date.parse(b.created_at)
            : 0;
          return aTs - bTs;
        });

      for (const kb of newKnowledgeBases) {
        const kbTimestamp = kb.created_at
          ? Date.parse(kb.created_at)
          : Date.now();
        this.$emit(
          kb,
          {
            id: kb.id || kbTimestamp,
            summary: `New Knowledge Base: ${kb.name}`,
            ts: kbTimestamp,
          },
        );
      }

      if (newKnowledgeBases.length > 0) {
        const newLastTimestamp = newKnowledgeBases.reduce((max, kb) => {
          const kbTs = kb.created_at
            ? Date.parse(kb.created_at)
            : 0;
          return kbTs > max
            ? kbTs
            : max;
        }, lastTimestamp);
        await this.db.set("lastEmitTimestamp", newLastTimestamp);
      }
    } catch (error) {
      console.error("Error during run method:", error);
    }
  },
};
