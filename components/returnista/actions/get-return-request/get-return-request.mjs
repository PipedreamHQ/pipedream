import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-request",
  name: "Get Return Request",
  description: "Gets a return request by ID. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId-/return-request/-id-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
      ],
    },
    returnRequestId: {
      propDefinition: [
        returnista,
        "returnRequestId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.returnista.getReturnRequest({
      $,
      accountId: this.accountId,
      returnRequestId: this.returnRequestId,
    });
    $.export("$summary", `Successfully retrieved return request with ID: ${this.returnRequestId}`);
    return response;
  },
};
