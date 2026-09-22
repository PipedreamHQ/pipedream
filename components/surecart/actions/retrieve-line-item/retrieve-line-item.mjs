import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-line-item",
  name: "Retrieve Line Item",
  description: "Retrieve a line item by ID. [See the documentation](https://developer.surecart.com/api-reference/line-items/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    lineItemId: {
      propDefinition: [
        surecart,
        "lineItemId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getLineItem({
      $,
      lineItemId: this.lineItemId,
    });
    $.export("$summary", `Successfully retrieved line item ${this.lineItemId}`);
    return response;
  },
};
