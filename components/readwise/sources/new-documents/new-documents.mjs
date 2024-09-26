import readwise from "../../readwise.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "readwise-new-documents",
  name: "New Documents",
  description: "Emit new document [See the documentation](https://readwise.io/reader_api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    readwise,
    timer: {
      label: "Polling interval",
      description: "Pipedream polls the Readwise API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    location: {
      type: "string",
      label: "Location",
      description: "(Optional) The document's location. [See the documentation](https://readwise.io/reader_api).",
      options: ["new", "later", "shortlist", "archive", "feed"],
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "(Optional) The document's category. [See the documentation](https://readwise.io/reader_api).",
      options: ["article", "email", "rss", "highlight", "note", "pdf", "epub", "tweet", "video"],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      await this.processEvent();
    },
  },
  methods: {
    async processDocuments(params) {
      const { results: events } = await this.readwise.listDocuments({
        params,
      });
      for (const event of events.slice(0, 100)) {
        this.emitEvent(event);
      }
    },
    async processEvent() {
      await this.processDocuments({
        location: this.location || "",
        category: this.category || "",
      });
    },
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New Document: ${event.id}`,
        ts: new Date(event.created_at),
      });
    },
  },
  async run() {
    return this.processEvent();
  },
};
