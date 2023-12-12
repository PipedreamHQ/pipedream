import app from "../../inksprout.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "inksprout-new-summary",
  name: "New event for each summary created. [See the docs](https://inksprout.co/docs/index.html#item-2-2).",
  description: "Emit new event when a summary is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Watching timer",
      description: "How often to watch the summaries.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emit(meta) {
      const ts = Date.parse(meta.created_at);
      this.$emit(meta, {
        id: meta.id,
        summary: `New summary: ${meta.article?.headline}`,
        ts,
      });
    },
  },
  async run({ $ }) {
    const result = await this.app.listSummaries($);
    for (const summary of result.summaries) {
      this.emit(summary);
    }
  },
};
