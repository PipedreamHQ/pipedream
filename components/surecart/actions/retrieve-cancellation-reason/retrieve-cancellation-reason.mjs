import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-cancellation-reason",
  name: "Retrieve Cancellation Reason",
  description: "Retrieve a cancellation reason by ID. [See the documentation](https://developer.surecart.com/api-reference/cancellation-reasons/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    cancellationReasonId: {
      propDefinition: [
        surecart,
        "cancellationReasonId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getCancellationReason({
      $,
      cancellationReasonId: this.cancellationReasonId,
    });
    $.export("$summary", `Successfully retrieved cancellation reason ${this.cancellationReasonId}`);
    return response;
  },
};
