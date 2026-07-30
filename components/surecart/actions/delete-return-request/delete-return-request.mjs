import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-delete-return-request",
  name: "Delete Return Request",
  description: "Delete a return request by ID. [See the documentation](https://developer.surecart.com/api-reference/return-requests/delete)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    returnRequestId: {
      propDefinition: [
        surecart,
        "returnRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.deleteReturnRequest({
      $,
      returnRequestId: this.returnRequestId,
    });
    $.export("$summary", `Successfully deleted return request ${this.returnRequestId}`);
    return response;
  },
};
