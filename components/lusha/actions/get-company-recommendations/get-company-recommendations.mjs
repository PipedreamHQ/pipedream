import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-company-recommendations",
  name: "Get Company Recommendations",
  description: "Get company recommendations based on other companies. Use requestId to get more results from a previous search. [See the documentation](https://docs.lusha.com/apis/openapi/company-recommendations/getcompanyrecommendations)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      description: "List of company objects to retrieve recommendations for. Example: [{ \"companyId\": \"123321\" }]. [See the documentation](https://docs.lusha.com/apis/openapi/company-recommendations/getcompanyrecommendations) for more information.",
    },
    exclude: {
      type: "string[]",
      label: "Exclude",
      description: "List of company objects to exclude from the recommendations. Example: [{ \"companyId\": \"123321\" }]. [See the documentation](https://docs.lusha.com/apis/openapi/company-recommendations/getcompanyrecommendations) for more information.",
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
    try {
      const response = await this.lusha.getCompanyRecommendations({
        $,
        params: {
          companies: parseObject(this.companies),
          exclude: parseObject(this.exclude),
          limit: this.limit,
          requestId: this.requestId,
        },
      });
      $.export("$summary", `Successfully retrieved ${response.count} company recommendations`);

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
