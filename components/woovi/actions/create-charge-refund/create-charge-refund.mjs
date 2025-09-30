import woovi from "../../woovi.app.mjs";

export default {
  key: "woovi-create-charge-refund",
  name: "Create Charge Refund",
  description: "Opens a refund request for a specific charge. [See the documentation](https://developers.woovi.com/en/api#tag/charge-refund/paths/~1api~1v1~1charge~1%7Bid%7D~1refund/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woovi,
    chargeId: {
      propDefinition: [
        woovi,
        "chargeId",
      ],
    },
    correlationId: {
      type: "string",
      label: "Correlation ID",
      description: "Your correlation ID to keep track for this refund",
    },
    value: {
      type: "integer",
      label: "Value",
      description: "Value in cents for this refund",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment for this refund",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.woovi.createChargeRefund({
      chargeId: this.chargeId,
      data: {
        correlationID: this.correlationId,
        value: this.value,
        comment: this.comment,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully created charge refund.");
    }

    return response;
  },
};
