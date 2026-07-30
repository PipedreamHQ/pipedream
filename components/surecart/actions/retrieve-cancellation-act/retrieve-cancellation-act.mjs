import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-cancellation-act",
  name: "Retrieve Cancellation Act",
  description: "Retrieve a cancellation act by ID. [See the documentation](https://developer.surecart.com/api-reference/cancellation-acts/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    cancellationActId: {
      propDefinition: [
        surecart,
        "cancellationActId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getCancellationAct({
      $,
      cancellationActId: this.cancellationActId,
    });
    $.export("$summary", `Successfully retrieved cancellation act ${this.cancellationActId}`);
    return response;
  },
};
