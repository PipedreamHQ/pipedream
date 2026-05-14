import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-get-return-requests",
  name: "Get Return Requests",
  description: "Gets a list of return requests for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#get-/account/-accountId-/return-requests)",
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
    limit: {
      propDefinition: [
        returnista,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        returnista,
        "page",
      ],
    },
    filter: {
      propDefinition: [
        returnista,
        "filter",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.returnista.getReturnRequests({
      $,
      accountId: this.accountId,
      params: {
        limit: this.limit,
        page: this.page,
        filter: this.filter,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} return request(s)`);
    return response;
  },
};
