import rumble from "../../rumble.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "rumble-new-live-stream",
  name: "New Live Stream",
  description: "Emit new event when a livestream becomes live in Rumble. [See the documentation](https://rumblefaq.groovehq.com/help/how-to-use-rumble-s-live-stream-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rumble,
    db: "$.service.db",
    timer: {
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
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(livestream) {
      return {
        id: livestream.id,
        summary: `${livestream.title} is live`,
        ts: Date.parse(livestream.created_on),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const { livestreams } = await this.rumble.getData();

    for (const livestream of livestreams) {
      const ts = Date.parse(livestream.created_on);
      if (livestream?.is_live && ts > lastTs) {
        const meta = this.generateMeta(livestream);
        this.$emit(livestream, meta);
        maxTs = Math.max(ts, maxTs);
      }
    }

    this._setLastTs(maxTs);
  },
  sampleEmit,
};
