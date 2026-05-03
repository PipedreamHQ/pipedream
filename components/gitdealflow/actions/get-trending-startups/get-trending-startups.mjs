import app from "../../gitdealflow.app.mjs";

export default {
  key: "gitdealflow-get-trending-startups",
  name: "Get Trending Startups",
  description:
    "Returns the top startups by engineering acceleration this period — commit velocity, contributor growth, signal type. [See docs](https://gitdealflow.com)",
  version: "0.1.0",
  type: "action",
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
