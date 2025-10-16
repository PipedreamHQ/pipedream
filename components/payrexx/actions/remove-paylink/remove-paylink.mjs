import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-remove-paylink",
  name: "Remove Paylink",
  description: "Remove a paylink. [See the documentation](https://developers.payrexx.com/reference/remove-a-paylink)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    payrexx,
    paylinkId: {
      propDefinition: [
        payrexx,
        "paylinkId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.payrexx.removePaylink({
      $,
      paylinkId: this.paylinkId,
    });

    $.export("$summary", `Successfully removed paylink with ID ${this.paylinkId}.`);
    return response;
  },
};
