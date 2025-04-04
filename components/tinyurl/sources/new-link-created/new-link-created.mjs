import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-new-link-created",
  name: "New Shortened URL Created",
  description: "Emit new event when a new shortened URL is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    tinyurl,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const { data } = await this.tinyurl.listURLs({
        type: "available",
        params: {
          from: lastDate,
        },
      });

      if (data.length) {
        if (maxResults && (data.length > maxResults)) {
          data.length = maxResults;
        }
        this._setLastDate(data[0].created_at);
      }

      for (const item of data.reverse()) {
        this.$emit(item, {
          id: item.alias,
          summary: `New TinyURL: ${item.tiny_url}`,
          ts: Date.parse(item.created_at),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
