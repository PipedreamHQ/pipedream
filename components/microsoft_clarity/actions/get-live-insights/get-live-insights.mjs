import app from "../../microsoft_clarity.app.mjs";

export default {
  key: "microsoft_clarity-get-live-insights",
  name: "Get Live Insights",
  description:
    "Fetch real-time analytics metrics for your Microsoft Clarity project, optionally broken down by up to three dimensions."
    + " Returns an array of metric objects (e.g. Traffic, Scroll Depth, Engagement Time, Dead Clicks, Rage Clicks, Script Errors)"
    + " each with a `metricName` and an `information` array of data points."
    + " Use `dimension1`, `dimension2`, and `dimension3` to segment data by Browser, Device, Country/Region, OS, Source, Medium, Campaign, Channel, or URL."
    + " **Rate limit: 10 requests per project per day — combine all desired dimensions into a single call rather than issuing multiple requests.**"
    + " Results are limited to 1,000 rows with no pagination."
    + " [See the documentation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    numOfDays: {
      propDefinition: [
        app,
        "numOfDays",
      ],
    },
    dimension1: {
      propDefinition: [
        app,
        "dimension",
      ],
      label: "Dimension 1",
      description: "Primary dimension to group analytics data by (e.g. `Device`, `Country`, `Browser`). Omit for aggregate totals only.",
    },
    dimension2: {
      propDefinition: [
        app,
        "dimension",
      ],
      label: "Dimension 2",
      description: "Secondary dimension for cross-segment breakdown (e.g. `OS` when Dimension 1 is `Device`). Must differ from Dimension 1.",
    },
    dimension3: {
      propDefinition: [
        app,
        "dimension",
      ],
      label: "Dimension 3",
      description: "Tertiary dimension for further segmentation. Must differ from Dimension 1 and Dimension 2.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getLiveInsights({
      $,
      numOfDays: this.numOfDays,
      dimension1: this.dimension1,
      dimension2: this.dimension2,
      dimension3: this.dimension3,
    });

    const metrics = Array.isArray(response)
      ? response
      : response?.value ?? response;

    const metricCount = Array.isArray(metrics)
      ? metrics.length
      : 0;

    $.export(
      "$summary",
      `Retrieved ${metricCount} metric${metricCount === 1
        ? ""
        : "s"} for the last ${this.numOfDays * 24} hours`,
    );

    return metrics;
  },
};
