import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import typefully from "../../typefully.app.mjs";

export default {
  key: "typefully-new-draft-scheduled",
  name: "New Draft Scheduled",
  description: "Emit a new event when a draft is scheduled for publication or added to the queue. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    typefully: {
      type: "app",
      app: "typefully",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    contentFilter: {
      propDefinition: [
        "typefully",
        "contentFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      try {
        const drafts = await this.typefully.getRecentlyScheduledDrafts();
        const latestDrafts = drafts.slice(-50).reverse();
        for (const draft of latestDrafts) {
          this.$emit(
            draft,
            {
              id: draft.id,
              summary: `Scheduled draft: ${draft.content}`,
              ts: draft.schedule_date
                ? Date.parse(draft.schedule_date)
                : Date.now(),
            },
          );
        }
      } catch (error) {
        this.$emit(error, {
          summary: "Error during deploy hook",
          ts: Date.now(),
        });
      }
    },
    async activate() {
      // No activation steps required for polling source
    },
    async deactivate() {
      // No deactivation steps required for polling source
    },
  },
  async run() {
    try {
      const drafts = await this.typefully.getRecentlyScheduledDrafts({
        content_filter: this.contentFilter,
      });
      for (const draft of drafts) {
        this.$emit(
          draft,
          {
            id: draft.id,
            summary: `Scheduled draft: ${draft.content}`,
            ts: draft.schedule_date
              ? Date.parse(draft.schedule_date)
              : Date.now(),
          },
        );
      }
    } catch (error) {
      this.$emit(error, {
        summary: "Error during run method",
        ts: Date.now(),
      });
    }
  },
};
