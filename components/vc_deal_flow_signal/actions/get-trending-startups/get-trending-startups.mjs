import app from "../../vc_deal_flow_signal.app.mjs";

export default {
  key: "vc_deal_flow_signal-get-trending-startups",
  name: "Get Trending Startups",
  description:
    "Returns the top startups by engineering acceleration this period — commit velocity, contributor growth, signal type. [See docs](https://gitdealflow.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
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
    const sectorMap = this.app.buildSectorMap(data?.sectors);

    const list = (data?.trending || []).slice(0, this.limit ?? 50);
    const enriched = list.map((startup, idx) => this.app.enrichStartup({
      startup,
      period,
      sectorName: sectorMap[startup?.name],
      citation,
      rank: idx + 1,
    }));

    $.export("$summary", `Returned ${enriched.length} trending startup(s) for ${period}`);
    return enriched;
  },
};
