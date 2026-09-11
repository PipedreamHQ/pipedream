import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-time-off-request-comments",
  name: "List Time Off Request Comments",
  description: "List the comments on a time off request, oldest first (GET /time-off/requests/{id}/comments). An empty thread returns an empty array. Use **List Time Off Requests** to find the request ID; use **Create Time Off Request Comment** to add one. [See the documentation](https://documentation.bamboohr.com/reference/list-time-off-request-comments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    bamboohr,
    requestId: {
      propDefinition: [
        bamboohr,
        "requestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.listTimeOffRequestComments({
      $,
      requestId: this.requestId,
    });
    const comments = response?.data ?? (Array.isArray(response)
      ? response
      : []);
    $.export("$summary", `Found ${comments.length} comment${comments.length === 1
      ? ""
      : "s"} on request ${this.requestId}`);
    return response;
  },
};
