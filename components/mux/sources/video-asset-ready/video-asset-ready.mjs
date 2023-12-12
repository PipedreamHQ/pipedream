import mux from "../../mux.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "mux-video-asset-ready",
  name: "New Video Asset Ready",
  description: "Emit new event when a video asset is set to ready status.",
  version: "0.0.1",
  type: "source",
  props: {
    mux,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getPreviouslyReady() {
      return this.db.get("previouslyReady") || {};
    },
    _setPreviouslyReady(previouslyReady) {
      this.db.set("previouslyReady", previouslyReady);
    },
    generateMeta(asset) {
      const ts = Date.now();
      return {
        id: `${asset.id}${ts}`,
        summary: `Asset with ID ${asset.id} is ready`,
        ts,
      };
    },
  },
  async run() {
    const previouslyReady = this._getPreviouslyReady();
    const currentlyReady = {};
    let total = 0;
    const params = {
      page: 1,
      limit: 25,
    };

    do {
      const { data } = await this.mux.listAssets({
        params,
      });
      for (const video of data) {
        if (video.status === "ready") {
          currentlyReady[video.id] = true;
          if (!previouslyReady[video.id]) {
            const meta = this.generateMeta(video);
            this.$emit(video, meta);
          }
        }
      }
      params.page += 1;
      total = data.length;
    } while (total === params.limit);

    this._setPreviouslyReady(currentlyReady);
  },
  sampleEmit,
};
