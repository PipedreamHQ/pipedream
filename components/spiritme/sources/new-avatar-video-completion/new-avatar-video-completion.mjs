import spiritme from "../../spiritme.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "spiritme-new-avatar-video-completion",
  name: "New Avatar Video Completion",
  description: "Emit new event when an avatar video completes rendering.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    spiritme,
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
    emitEvent(video) {
      const meta = this.generateMeta(video);
      this.$emit(video, meta);
    },
    generateMeta(video) {
      return {
        id: video.id,
        summary: `New Video: ${video.name}`,
        ts: Date.parse(video.gd),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const params = {
        limit: 100,
        offset: 0,
        status: [
          "success",
        ],
      };
      let total;

      const videos = [];
      do {
        const { results } = await this.spiritme.listVideos({
          params,
        });
        for (const video of results) {
          const ts = Date.parse(video.gd);
          if (ts >= lastTs && (!max || videos.length < max)) {
            videos.push(video);
          } else {
            break;
          }
        }
        params.offset += params.limit;
        total = results?.length;
      } while (total === params.limit && (!max || videos.length < max));

      if (!videos.length) {
        return;
      }

      this._setLastTs(Date.parse(videos[0].gd));
      videos.reverse().forEach((video) => this.emitEvent(video));
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
