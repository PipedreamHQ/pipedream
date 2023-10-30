import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import Sonix from "../../sonix.app.mjs";

export default {
  key: "sonix-media-upload-complete",
  name: "Media Upload Complete",
  description: "Emits a new event any time the media status of an item changes to completed.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sonix: {
      type: "app",
      app: "sonix",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastMediaStatus() {
      return this.db.get("lastMediaStatus") ?? null;
    },
    _setLastMediaStatus(status) {
      this.db.set("lastMediaStatus", status);
    },
  },
  hooks: {
    async deploy() {
      const media = await this.sonix.listMedia({
        params: {
          status: "completed",
        },
      });
      for (const item of media) {
        if (item.status === "completed") {
          this.$emit(item, {
            id: item.id,
            summary: `Media upload completed: ${item.name}`,
            ts: Date.parse(item.created_at),
          });
        }
      }
    },
  },
  async run() {
    const media = await this.sonix.listMedia({
      params: {
        status: "completed",
      },
    });
    const lastMediaStatus = this._getLastMediaStatus();
    for (const item of media) {
      if (item.status === "completed" && item.id !== lastMediaStatus?.id) {
        this.$emit(item, {
          id: item.id,
          summary: `Media upload completed: ${item.name}`,
          ts: Date.parse(item.created_at),
        });
      }
    }
    if (media.length > 0) {
      this._setLastMediaStatus(media[0]);
    }
  },
};
