import app from "../../gitdealflow.app.mjs";

export default {
  key: "gitdealflow-new-engineering-signal",
  name: "New Engineering Signal",
  description:
    "Emits one event for each new (startup, signal type) pair. Polls daily. Dedupes by `period + name + signalType`. Optional filter by signal type.",
  version: "0.1.0",
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
    const filter = this.signalTypeFilter;

    let emitted = 0;
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
        emitted++;
      }
    }

    if ($?.export) $.export("$summary", `Emitted ${emitted} engineering signal event(s)`);
  },
};
