import monta from "../../monta.app.mjs";

export default {
  key: "monta-get-return",
  name: "Get Return",
  description: "Get a return by ID. [See the documentation](https://api-v6.monta.nl/index.html#tag/Return/paths/~1return~1%7Bid%7D/get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    returnId: {
      propDefinition: [
        monta,
        "returnId",
        ({ orderId }) => ({
          orderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.monta.getReturn({
      $,
      returnId: this.returnId,
    });

    $.export("$summary", `Successfully retrieved return with ID \`${this.returnId}\`.`);
    return response;
  },
};
