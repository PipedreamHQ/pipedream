import app from "../../sibfly.app.mjs";

export default {
  key: "sibfly-check-ground-motion",
  name: "Check Ground Motion",
  description: "Measure how fast the ground is sinking or rising (mm/year, negative = sinking) under a US address, from NASA OPERA Sentinel-1 InSAR. Costs $0.40 for a covered report; out-of-coverage / low-quality results are free. Use Dry Run for a free coverage + price preview. [See the documentation](https://sibfly.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    lat: {
      propDefinition: [
        app,
        "lat",
      ],
    },
    lon: {
      propDefinition: [
        app,
        "lon",
      ],
    },
    dryRun: {
      propDefinition: [
        app,
        "dryRun",
      ],
    },
  },
  async run({ $ }) {
    if (!this.address && (!this.lat || !this.lon)) {
      throw new Error("Provide an Address, or both Latitude and Longitude.");
    }
    const response = await this.app.checkGroundMotion({
      $,
      address: this.address,
      lat: this.lat,
      lon: this.lon,
      dryRun: this.dryRun,
    });

    const where = this.address ?? `${this.lat},${this.lon}`;
    const summary = response.velocity_vertical_mm_yr != null
      ? `${where}: ${response.velocity_vertical_mm_yr} mm/yr (${response.assessment_code}), cost $${response.cost_usd}`
      : `${where}: ${response.status ?? "no data"} (free, $0)`;
    $.export("$summary", summary);

    return response;
  },
};
