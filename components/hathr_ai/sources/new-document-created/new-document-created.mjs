import hathrAi from "../../hathr_ai.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "hathr_ai-new-document-created",
  name: "New Document Created",
  description: "Emit new event when a new document is created. [See the documentation](https://drive.google.com/drive/folders/1jtoSXqzhe-iwf9kfUwTCVQBu4iXVJO2x?usp=sharing)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    hathrAi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    generateMeta(doc) {
      return {
        id: doc.name,
        summary: `New Document Created: ${doc.name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const { response: { documents } } = await this.hathrAi.listDocuments();
    for (const doc of documents) {
      const meta = this.generateMeta(doc);
      this.$emit(doc, meta);
    }
  },
};
