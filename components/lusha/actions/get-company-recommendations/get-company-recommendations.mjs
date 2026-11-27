import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-company-recommendations",
  name: "Get Company Recommendations",
  description: "Get company recommendations based on other companies. Use requestId to get more results from a previous search. [See the documentation](https://docs.lusha.com/tutorials/recommendations)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    lusha,
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Request ID for getting more results",
      optional: true,
    },
    companies: {
      type: "string[]",
      label: "Companies",
      description: "List of company objects to retrieve recommendations for. Example: [{ \"companyId\": \"123321\" }]. [See the documentation](https://docs.lusha.com/tutorials/recommendations) for more information.",
    },
    exclude: {
      type: "string[]",
      label: "Exclude",
      description: "List of company objects to exclude from the recommendations. Example: [{ \"companyId\": \"123321\" }]. [See the documentation](https://docs.lusha.com/tutorials/recommendations) for more information.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return.",
      min: 5,
      max: 25,
      default: 25,
    },
  },
  async run({ $ }) {
    const response = await this.lusha.getCompanyRecommendations({
      $,
      data: {
        companies: parseObject(this.companies),
        exclude: parseObject(this.exclude),
        limit: this.limit,
        requestId: this.requestId,
      },
    });
    $.export("$summary", response.count === undefined
      ? "Retrieved company recommendations"
      : `Retrieved ${response.count} company recommendation${response.count === 1
        ? ""
        : "s"}`);
    return response;
  },
};
