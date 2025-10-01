import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-measure-usage",
  name: "Measure Usage",
  description: "Records the amount of a specific usage type linked with a customer. [See the documentation](http://www.api.docs.paigo.tech/#tag/Usage/operation/Collect%20usage%20data)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    paigo,
    customerId: {
      propDefinition: [
        paigo,
        "customerId",
      ],
    },
    dimensionId: {
      propDefinition: [
        paigo,
        "dimensionId",
      ],
    },
    usageAmount: {
      type: "string",
      label: "Usage Amount",
      description: "The amount of the usage on this record. Numerical values are represented as strings to avoid precision loss.",
    },
    timestamp: {
      type: "string",
      label: "Timestamp",
      description: "The timestamp of usage record in RFC3339 format with a 4-digit year. This is the time the usage occurred, or the end of the usage period. Defaults to the current time.",
      default: new Date().toISOString()
        .slice(0, 19)
        .replace("T", " ") + "Z",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paigo.recordUsage({
      $,
      data: {
        customerId: this.customerId,
        dimensionId: this.dimensionId,
        recordValue: this.usageAmount,
        timestamp: this.timestamp,
      },
    });
    $.export("$summary", `Recorded usage for customer: ${this.customerId}`);
    return response;
  },
};
