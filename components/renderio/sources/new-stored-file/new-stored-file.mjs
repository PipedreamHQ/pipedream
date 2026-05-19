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
    db: "$.service.db",
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
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(file) {
      return {
        id: file.file_id,
        summary: `New stored file: ${file.file_id}`,
        ts: getTimestamp(file),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const files = [];

    const response = await this.renderio.listFiles({
      params: {
        limit: 100,
      },
    });

    for (const file of normalizeList(response, "files")) {
      const ts = getTimestamp(file);
      if (ts <= lastTs) continue;

      files.push(file);
    }

    files.sort((a, b) => getTimestamp(a) - getTimestamp(b));

    for (const file of files) {
      this.$emit(file, this.generateMeta(file));
    }

    if (files.length > 0) {
      this._setLastTs(getTimestamp(files[files.length - 1]));
    }
  },
  sampleEmit,
};
