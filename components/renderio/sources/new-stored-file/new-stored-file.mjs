import renderio from "../../renderio.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  getTimestamp,
  normalizeList,
} from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "renderio-new-stored-file",
  name: "New Stored File",
  description: "Emit new event when a new file is uploaded to the account. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    renderio,
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the RenderIO API on this schedule.",
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
        summary: `New stored file: ${file.file_id}`,
        ts: getTimestamp(file),
      };
    },
  },
  async run() {
    const response = await this.renderio.listFiles({
      params: {
        limit: 100,
      },
    });

    for (const file of normalizeList(response, "files")) {
      this.$emit(file, this.generateMeta(file));
    }
  },
  sampleEmit,
};
