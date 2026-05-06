import app from "../../vc_deal_flow_signal.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "vc_deal_flow_signal-new-engineering-signal",
  name: "New Engineering Signal",
  description:
    "Emit new event for each new (startup, signal type) pair. Dedupes by `period + name + signalType`. Optional filter by signal type.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    signalTypeFilter: {
      propDefinition: [
        app,
        "signalTypeFilter",
      ],
    },
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const data = await this.app.getSignals();
    const period = data?.meta?.period?.name || "current";
    const citation = data?.meta?.citation || "";
    const filter = this.signalTypeFilter;

    for (const sector of data?.sectors || []) {
      for (const s of sector.startups || []) {
        if (!s.signalType) continue;
        if (filter && s.signalType !== filter) continue;
        const enriched = this.app.enrichStartup({
          startup: s,
          period,
          sectorName: sector.name,
          citation,
        });
        const id = `${period}-${this.app.normalize(s.name)}-${this.app.normalize(
          s.signalType,
        )}`;
        this.$emit(enriched, {
          id,
          summary: `${s.name} — ${s.signalType} (${period})`,
          ts: Date.now(),
        });
      }
    }
  },
};
