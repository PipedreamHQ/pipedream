import ismalicious from "../../ismalicious.app.mjs";

export default {
  key: "ismalicious-check-ip",
  name: "Check IP",
  description: "Enrich one IPv4 or IPv6 address with reputation, risk and source evidence. This does not fetch the target or change blocking rules. [See the documentation](https://ismalicious.com/api-docs)",
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
      label: "IP",
      description: "The exact IPv4 or IPv6 address to enrich, e.g. `203.0.113.7` or `2001:db8::1`. Sent to the hosted API using your account's request quota.",
    },
  },
  async run({ $ }) {
    const response = await this.ismalicious.checkIndicator({
      $,
      indicator: this.indicator,
      indicatorType: "ip",
    });
    $.export("$summary", "Retrieved isMalicious reputation and evidence for one IPv4 or IPv6 address.");
    return response;
  },
};
