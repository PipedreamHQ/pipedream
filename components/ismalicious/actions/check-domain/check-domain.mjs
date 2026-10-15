import ismalicious from "../../ismalicious.app.mjs";

export default {
  key: "ismalicious-check-domain",
  name: "Check Domain",
  description: "Enrich one domain name with reputation, risk and source evidence. This does not fetch the target or change blocking rules. [See the documentation](https://ismalicious.com/api-docs)",
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
      label: "Domain",
      description: "The exact domain name to enrich, e.g. `example.com`. Sent to the hosted API using your account's request quota.",
    },
  },
  async run({ $ }) {
    const response = await this.ismalicious.checkIndicator({
      $,
      indicator: this.indicator,
      indicatorType: "domain",
    });
    $.export("$summary", "Retrieved isMalicious reputation and evidence for one domain name.");
    return response;
  },
};
