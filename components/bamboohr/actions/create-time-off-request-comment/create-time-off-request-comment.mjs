import bamboohr from "../../bamboohr.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bamboohr-create-time-off-request-comment",
  name: "Create Time Off Request Comment",
  description: "Add a comment to a time off request (POST /time-off/requests/{id}/comments). Use **List Time Off Requests** to find the request ID and **List Time Off Request Comments** to review the existing thread first. [See the documentation](https://documentation.bamboohr.com/reference/create-time-off-request-comment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment text. Must not be empty or whitespace only.",
    },
  },
  async run({ $ }) {
    if (!this.comment.trim()) {
      throw new ConfigurationError("Comment must not be empty or whitespace only.");
    }
    const response = await this.bamboohr.createTimeOffRequestComment({
      $,
      requestId: this.requestId,
      data: {
        comment: this.comment,
      },
    });
    $.export("$summary", `Added a comment to time off request ${this.requestId}`);
    return response;
  },
};
