import app from "../../vc_deal_flow_signal.app.mjs";

export default {
  key: "vc_deal_flow_signal-find-startup",
  name: "Find Startup by Name",
  description:
    "Look up a single startup's full signal profile. Case-insensitive match on display name or GitHub org slug.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startupName: {
      propDefinition: [
        app,
        "startupName",
      ],
    },
  },
  async run({ $ }) {
    const data = await this.app.getSignals({
      $,
    });
    const period = data?.meta?.period?.name || "current";
    const citation = data?.meta?.citation || "";
    const target = this.app.normalize(this.startupName);

    for (const sector of data?.sectors || []) {
      for (const s of sector.startups || []) {
        if (this.app.normalize(s.name) === target) {
          const enriched = this.app.enrichStartup({
            startup: s,
            period,
            sectorName: sector.name,
            citation,
          });
          $.export("$summary", `Found ${s.name} in ${sector.name}`);
          return {
            found: true,
            ...enriched,
          };
        }
      }
    }

    $.export("$summary", `No match for "${this.startupName}" in ${period}`);
    return {
      found: false,
      query: this.startupName,
      period,
      citation,
    };
  },
};
