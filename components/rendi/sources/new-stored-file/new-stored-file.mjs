import rendi from "../../rendi.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "rendi-new-stored-file",
  name: "New Stored File",
  description: "Emit new event when a new file is uploaded to an account. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/list-files)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rendi,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    generateMeta(file) {
      return {
        id: file.file_id,
        summary: `New Stored File with ID: ${file.file_id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const files = await this.rendi.listFiles();
    for (const file of files) {
      const meta = this.generateMeta(file);
      this.$emit(file, meta);
    }
  },
  sampleEmit,
};
