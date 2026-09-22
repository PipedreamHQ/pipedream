import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-return-request",
  name: "Retrieve Return Request",
  description: "Retrieve a return request by ID. [See the documentation](https://developer.surecart.com/api-reference/return-requests/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.surecart.getReturnRequest({
      $,
      returnRequestId: this.returnRequestId,
    });
    $.export("$summary", `Successfully retrieved return request ${this.returnRequestId}`);
    return response;
  },
};
