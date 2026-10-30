import ismalicious from "../../ismalicious.app.mjs";

export default {
  key: "ismalicious-check-file-hash",
  name: "Check File Hash",
  description: "Enrich one MD5, SHA-1 or SHA-256 file hash with reputation, risk and source evidence. This does not fetch the target or change blocking rules. [See the documentation](https://ismalicious.com/api-docs)",
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
      label: "File Hash",
      description: "The exact MD5, SHA-1 or SHA-256 file hash to enrich, e.g. `d41d8cd98f00b204e9800998ecf8427e`. Sent to the hosted API using your account's request quota.",
    },
  },
  async run({ $ }) {
    const response = await this.ismalicious.checkIndicator({
      $,
      indicator: this.indicator,
      indicatorType: "hash",
    });
    $.export("$summary", "Retrieved isMalicious reputation and evidence for one MD5, SHA-1 or SHA-256 file hash.");
    return response;
  },
};
