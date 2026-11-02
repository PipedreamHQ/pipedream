import ismalicious from "../../ismalicious.app.mjs";

export default {
  key: "ismalicious-check-url",
  name: "Check URL",
  description: "Enrich one HTTP or HTTPS URL with reputation, risk and source evidence. This does not fetch the target or change blocking rules. [See the documentation](https://ismalicious.com/api-docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ismalicious,
    indicator: {
      propDefinition: [
        ismalicious,
        "indicator",
      ],
      label: "URL",
      description: "The exact HTTP or HTTPS URL to enrich, e.g. `https://example.com/login`. Sent to the hosted API using your account's request quota.",
    },
  },
  async run({ $ }) {
    const response = await this.ismalicious.checkIndicator({
      $,
      indicator: this.indicator,
      indicatorType: "url",
    });
    $.export("$summary", "Retrieved isMalicious reputation and evidence for one HTTP or HTTPS URL.");
    return response;
  },
};
