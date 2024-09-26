import vimeo from "../../vimeo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    vimeo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(video) {
      return {
        id: video.uri.split("/").pop(),
        summary: this.getSummary(video),
        ts: Date.parse(video.created_time),
      };
    },
    emitEvent(video) {
      const meta = this.generateMeta(video);
      this.$emit(video, meta);
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const params = this.getParams();

      const items = this.vimeo.paginate({
        resourceFn,
        params,
        max,
      });

      for await (const item of items) {
        const ts = Date.parse(item.created_time);
        if (ts >= lastTs) {
          maxTs = Math.max(ts, maxTs);
          this.emitEvent(item);
        }
      }

      this._setLastTs(maxTs);
    },
    getParams() {
      return {};
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
