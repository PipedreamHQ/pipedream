import app from "../../vc_deal_flow_signal.app.mjs";

export default {
  key: "vc_deal_flow_signal-search-by-sector",
  name: "Search Startups by Sector",
  description:
    "Return every tracked startup in one of the 20 sectors, ranked by engineering acceleration.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sector: {
      propDefinition: [
        app,
        "sector",
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

    const target = this.sector;
    const sector = (data?.sectors || []).find(
      (s) => s.slug === target || this.app.normalize(s.name) === target,
    );

    if (!sector) {
      $.export("$summary", `Sector not found: ${target}`);
      return [];
    }

    const list = (sector.startups || []).slice(0, this.limit ?? 50);
    const enriched = list.map((startup, idx) => this.app.enrichStartup({
      startup,
      period,
      sectorName: sector.name,
      citation,
      rank: idx + 1,
    }));

    $.export(
      "$summary",
      `Returned ${enriched.length} startup(s) in ${sector.name} (${period})`,
    );
    return enriched;
  },
};
