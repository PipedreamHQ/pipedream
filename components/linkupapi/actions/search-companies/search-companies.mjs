import app from "../../linkupapi.app.mjs";
import { ACTIONS } from "../../common/constants.mjs";

export default {
  type: "action",
  key: "linkupapi-search-companies",
  name: "Search Companies",
  description: "Search for LinkedIn companies. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/search-companies)",
  version: "1.0.0",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    keyword: {
      propDefinition: [
        app,
        "keyword",
      ],
      description: "Free-text keyword to search companies by (e.g. company name or industry).",
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    totalResults: {
      propDefinition: [
        app,
        "totalResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.profiles({
      $,
      data: {
        account_id: this.accountId,
        action: ACTIONS.SEARCH_COMPANIES,
        params: {
          keyword: this.keyword,
          location: this.location,
          total_results: this.totalResults,
        },
      },
    });

    $.export("$summary", "Successfully retrieved companies");
    return response;
  },
};
