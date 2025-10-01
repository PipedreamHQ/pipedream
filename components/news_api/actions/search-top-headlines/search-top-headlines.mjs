import newsapi from "../../news_api.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "news_api-search-top-headlines",
  name: "Search Top Headlines",
  description: "Retrieve live top and breaking headlines for a category, single source, multiple sources, or keywords. [See the documentation](https://newsapi.org/docs/endpoints/top-headlines)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    newsapi,
    q: {
      propDefinition: [
        newsapi,
        "q",
      ],
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "The category you want to get headlines for. Possible options: `business` `entertainment` `general` `health` `science` `sports` `technology`. Note: you can't mix this param with the `sources` param.",
      optional: true,
    },
    sourceIds: {
      propDefinition: [
        newsapi,
        "sourceIds",
      ],
    },
    maxResults: {
      propDefinition: [
        newsapi,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    if (this.category && this.sourceIds) {
      throw new ConfigurationError("Please specify only one of `Category` or `SourceIds`");
    }

    const params = {
      q: this.q,
      category: this.category,
      sources: utils.joinArray(this.sourceIds),
      pageSize: this.maxResults,
    };

    // The only available country is "us", but it can't be specified along with category or sources.
    // At least one of q, category, sources, or country must be entered, so adding in country if
    // none of the others are specified.
    if (!this.q && !this.category && !this.sourceIds) {
      params.country = "us";
    }

    const {
      status, articles,
    } = await this.newsapi.searchTopHeadlines({
      $,
      params,
    });

    if (status === "ok") {
      $.export("$summary", `Successfully retrieved ${articles.length} article${articles.length === 1
        ? ""
        : "s"}`);
    }

    return articles;
  },
};
