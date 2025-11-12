import airparser from "../../airparser.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "airparser-new-document-parsed",
  name: "New Document Parsed",
  description: "Emit new event when a document is parsed. [See the documentation](https://help.airparser.com/public-api/public-api)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    airparser,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    inboxId: {
      propDefinition: [
        airparser,
        "inboxId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    generateMeta(doc) {
      const ts = Date.parse(doc.processed_at);
      return {
        id: `${doc._id}${ts}`,
        summary: `New Document ${doc.name}`,
        ts,
      };
    },
    async processEvent(max) {
      const items = this.airparser.paginate({
        resourceFn: this.airparser.listDocuments,
        args: {
          inboxId: this.inboxId,
          params: {
            statuses: [
              "parsed",
            ],
          },
        },
        resourceType: "docs",
        max,
      });

      for await (const item of items) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
