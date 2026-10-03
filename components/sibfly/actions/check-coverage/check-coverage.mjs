import app from "../../sibfly.app.mjs";

export default {
  key: "sibfly-check-coverage",
  name: "Check Coverage",
  description: "Free pre-flight: is a US address or point covered by SibFly, how stale is the data (`data_age_days`), and what would a report cost (`would_cost_usd`). Always free. [See the documentation](https://sibfly.com/docs).",
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
  },
  async run({ $ }) {
    if (!this.address && (!this.lat || !this.lon)) {
      throw new Error("Provide an Address, or both Latitude and Longitude.");
    }
    const response = await this.app.checkCoverage({
      $,
      address: this.address,
      lat: this.lat,
      lon: this.lon,
    });

    const where = this.address ?? `${this.lat},${this.lon}`;
    const summary = response.covered
      ? `${where}: covered, would cost $${response.would_cost_usd}, data ~${response.data_age_days} days old`
      : `${where}: not covered (a report would be free)`;
    $.export("$summary", summary);

    return response;
  },
};
