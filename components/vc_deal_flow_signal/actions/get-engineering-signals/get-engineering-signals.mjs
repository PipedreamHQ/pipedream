import app from "../../vc_deal_flow_signal.app.mjs";

export default {
  key: "vc_deal_flow_signal-get-engineering-signals",
  name: "Get Engineering Signals",
  description:
    "Return every startup that emitted an engineering signal (deploy spike, infra buildout, framework migration, hiring burst). Optional filter by signal type.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    signalTypeFilter: {
      propDefinition: [
        app,
        "signalTypeFilter",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const data = await this.app.getSignals({
      $,
    });
    const period = data?.meta?.period?.name || "current";
    const citation = data?.meta?.citation || "";
    const filter = this.signalTypeFilter;

    const all = [];
    for (const sector of data?.sectors || []) {
      for (const s of sector.startups || []) {
        if (s.signalType && (!filter || s.signalType === filter)) {
          all.push({
            startup: s,
            sectorName: sector.name,
          });
        }
      }
    }

    const limited = all.slice(0, this.limit ?? 50);
    const enriched = limited.map(({
      startup, sectorName,
    }, idx) => this.app.enrichStartup({
      startup,
      period,
      sectorName,
      citation,
      rank: idx + 1,
    }));

    $.export(
      "$summary",
      `Returned ${enriched.length} engineering signal(s) for ${period}${filter
        ? ` (filter: ${filter})`
        : ""}`,
    );
    return enriched;
  },
};
