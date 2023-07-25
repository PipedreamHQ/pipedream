import mux from "../../mux.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "mux-live-stream-active",
  name: "New Live Stream Active",
  description: "Emit new event when a live-stream is set to active status.",
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
    _getPreviouslyActive() {
      return this.db.get("previouslyActive") || {};
    },
    _setPreviouslyActive(previouslyActive) {
      this.db.set("previouslyActive", previouslyActive);
    },
    generateMeta(livestream) {
      const ts = Date.now();
      return {
        id: `${livestream.id}${ts}`,
        summary: `Livestream with ID ${livestream.id} is active`,
        ts,
      };
    },
  },
  async run() {
    const previouslyActive = this._getPreviouslyActive();
    const currentlyActive = {};
    let total = 0;
    const params = {
      status: "active",
      page: 1,
      limit: 25,
    };

    do {
      const { data } = await this.mux.listLiveStreams({
        params,
      }); console.log(data);
      for (const liveStream of data) {
        currentlyActive[liveStream.id] = true;
        if (!previouslyActive[liveStream.id]) {
          const meta = this.generateMeta(liveStream);
          this.$emit(liveStream, meta);
        }
      }
      params.page += 1;
      total = data.length;
    } while (total === params.limit);

    this._setPreviouslyActive(currentlyActive);
  },
  sampleEmit,
};
