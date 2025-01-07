import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import typefully from "../../typefully.app.mjs";

export default {
  key: "typefully-new-draft-published",
  name: "New Draft Published",
  description: "Emit new event when a draft is published to Twitter via Typefully. [See the documentation](#)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    typefully,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    kind: {
      propDefinition: [
        "typefully",
        "kind",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      try {
        const drafts = await this.typefully.getRecentlyPublishedDrafts({
          params: {
            ...(this.kind
              ? {
                kind: this.kind,
              }
              : {}),
          },
        });
        const sortedDrafts = drafts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        const draftsToEmit = sortedDrafts.slice(0, 50);

        for (const draft of draftsToEmit) {
          this.$emit(draft, {
            id: draft.id || new Date(draft.published_at).getTime(),
            summary: `Draft Published: ${draft.content.substring(0, 50)}...`,
            ts: new Date(draft.published_at).getTime(),
          });
        }

        if (draftsToEmit.length > 0) {
          const latestTimestamp = new Date(draftsToEmit[0].published_at).getTime();
          await this.db.set("last_published_ts", latestTimestamp);
        }
      } catch (error) {
        this.$emit(error, {
          summary: "Error during deploy",
          ts: Date.now(),
        });
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook unsubscription needed for polling source
    },
  },
  async run() {
    try {
      const lastTs = (await this.db.get("last_published_ts")) || 0;
      const drafts = await this.typefully.getRecentlyPublishedDrafts({
        params: {
          ...(this.kind
            ? {
              kind: this.kind,
            }
            : {}),
        },
      });

      const newDrafts = drafts.filter((draft) => new Date(draft.published_at).getTime() > lastTs);
      const sortedNewDrafts = newDrafts.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));

      for (const draft of sortedNewDrafts) {
        this.$emit(draft, {
          id: draft.id || new Date(draft.published_at).getTime(),
          summary: `Draft Published: ${draft.content.substring(0, 50)}...`,
          ts: new Date(draft.published_at).getTime(),
        });
      }

      if (drafts.length > 0) {
        const latestDraft = drafts[0];
        const latestTs = new Date(latestDraft.published_at).getTime();
        await this.db.set("last_published_ts", latestTs);
      }
    } catch (error) {
      this.$emit(error, {
        summary: "Error during run",
        ts: Date.now(),
      });
    }
  },
};
