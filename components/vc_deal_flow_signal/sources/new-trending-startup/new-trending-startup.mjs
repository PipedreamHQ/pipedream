import app from "../../vc_deal_flow_signal.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "vc_deal_flow_signal-new-trending-startup",
  name: "New Trending Startup",
  description:
    "Emit new event for each new startup that enters the top 20 by engineering acceleration. Polls weekly. Dedupes by `period + name`.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run({ $ }) {
    const data = await this.app.getSignals({
      $,
    });
    const period = data?.meta?.period?.name || "current";
    const citation = data?.meta?.citation || "";
    const sectorMap = this.app.buildSectorMap(data?.sectors);

    const seen = new Set();
    const trending = [];
    for (const s of data?.trending || []) {
      if (!s?.name) continue;
      const key = s.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      trending.push(s);
    }

    trending.forEach((startup, idx) => {
      const enriched = this.app.enrichStartup({
        startup,
        period,
        sectorName: sectorMap[startup.name],
        citation,
        rank: idx + 1,
      });
      const id = `${period}-${this.app.normalize(startup.name)}`;
      this.$emit(enriched, {
        id,
        summary: `#${idx + 1} ${startup.name} (${period})`,
        ts: Date.now(),
      });
    });
  },
};
