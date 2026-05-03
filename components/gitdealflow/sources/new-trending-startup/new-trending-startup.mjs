import app from "../../gitdealflow.app.mjs";

export default {
  key: "gitdealflow-new-trending-startup",
  name: "New Trending Startup",
  description:
    "Emits one event for each new startup that enters the top 20 by engineering acceleration. Polls weekly. Dedupes by `period + name`.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 60 * 60 * 24,
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

    let emitted = 0;
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
      emitted++;
    });

    if ($?.export) $.export("$summary", `Emitted ${emitted} trending startup event(s)`);
  },
};
