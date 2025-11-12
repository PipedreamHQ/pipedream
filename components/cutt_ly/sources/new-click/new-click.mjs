import cuttLy from "../../cutt_ly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "cutt_ly-new-click",
  name: "New Click",
  description: "Emit new event each time a shortened URL receives a new click.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    cuttLy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    shortenedUrl: {
      type: "string",
      label: "Shortened URL",
      description: "The URL you want to watch for new clicks",
    },
  },
  methods: {
    _getClicks() {
      return this.db.get("clicks") || 0;
    },
    _setClicks(clicks) {
      this.db.set("clicks", clicks);
    },
    generateMeta(difference) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `${difference} new click${difference === 1
          ? ""
          : "s"}`,
        ts,
      };
    },
  },
  async run() {
    const clicks = this._getClicks();
    const { stats } = await this.cuttLy.callApi({
      params: {
        stats: this.shortenedUrl,
      },
    });
    if (stats.clicks > clicks) {
      const difference = stats.clicks - clicks;
      const meta = this.generateMeta(difference);
      this.$emit(stats, meta);
      this._setClicks(stats.clicks);
    }
  },
  sampleEmit,
};
