import ups from "../../ups.app.mjs";

export default {
  key: "ups-recover-label",
  name: "Recover Label",
  description: "Recover a label. [See the documentation](https://developer.ups.com/tag/Shipping?loc=en_US#operation/LabelRecovery)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ups,
    trackingNumber: {
      propDefinition: [
        ups,
        "trackingNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ups.recoverLabel({
      $,
      data: {
        LabelRecoveryRequest: {
          Request: {
            SubVersion: "1903",
          },
          TrackingNumber: this.trackingNumber,
        },
      },
    });

    $.export("$summary", `Successfully recovered label for shipment with tracking number ${this.trackingNumber}`);
    return response;
  },
};
