import app from "../../linkupapi.app.mjs";
import { ACTIONS } from "../../common/constants.mjs";

export default {
  type: "action",
  key: "linkupapi-search-profiles",
  name: "Search Profiles",
  description: "Search for LinkedIn people. [See the documentation](https://docs.linkupapi.com/api-reference/v2/profiles/search-people)",
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
      description: "Free-text keyword to search people by (e.g. name, title, or company).",
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    companyUrl: {
      propDefinition: [
        app,
        "companyUrl",
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
        action: ACTIONS.SEARCH_PEOPLE,
        params: {
          keyword: this.keyword,
          location: this.location,
          company_url: this.companyUrl,
          total_results: this.totalResults,
        },
      },
    });

    $.export("$summary", "Successfully retrieved profiles");
    return response;
  },
};
