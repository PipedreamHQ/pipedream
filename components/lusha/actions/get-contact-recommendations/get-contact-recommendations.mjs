import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-contact-recommendations",
  name: "Get Contact Recommendations",
  description: "Fetch recommended contacts by supplying the contact's IDs, enabling Lusha to return similar profiles aligned by job title, seniority, and company context. Use requestId to get more results from a previous search. [See the documentation](https://docs.lusha.com/apis/openapi/contact-recommendations/getcontactrecommendations)",
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
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "List of contact objects to retrieve recommendations for. Example: [{ \"personId\": \"123321\", \"companyId\": \"456789\" }]. [See the documentation](https://docs.lusha.com/apis/openapi/contact-recommendations/getcontactrecommendations) for more information.",
    },
    exclude: {
      type: "string[]",
      label: "Exclude",
      description: "List of contact objects to exclude from the recommendations. Example: [{ \"personId\": \"123321\", \"companyId\": \"456789\" }]. [See the documentation](https://docs.lusha.com/apis/openapi/contact-recommendations/getcontactrecommendations) for more information.",
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
      const response = await this.lusha.getContactRecommendations({
        $,
        params: {
          contacts: parseObject(this.contacts),
          exclude: parseObject(this.exclude),
          limit: this.limit,
          requestId: this.requestId,
        },
      });
      $.export("$summary", `Successfully retrieved ${response.count} contact recommendations`);

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
