import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-search-news-articles",
  name: "Search News Articles",
  description: "Search for news articles related to one or more Apollo organizations. Use **Search For Organizations** to find organization IDs first. [See the documentation](https://docs.apollo.io/reference/news-articles-search)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    organizationIds: {
      propDefinition: [
        app,
        "organizationId",
      ],
      type: "string[]",
      label: "Organization IDs",
      description: "One or more Apollo organization IDs to fetch news for. At least one ID is required.",
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "Optional news category filters (free-form strings; Apollo does not enumerate values). Example: `[\"hires\", \"funding\"]`",
      optional: true,
    },
    publishedAtMin: {
      type: "string",
      label: "Published After",
      description: "Earliest publish date (YYYY-MM-DD)",
      optional: true,
    },
    publishedAtMax: {
      type: "string",
      label: "Published Before",
      description: "Latest publish date (YYYY-MM-DD)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      organization_ids: this.organizationIds,
      categories: this.categories,
      ...(this.publishedAtMin && {
        "published_at[min]": this.publishedAtMin,
      }),
      ...(this.publishedAtMax && {
        "published_at[max]": this.publishedAtMax,
      }),
    };

    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.searchNewsArticles,
      resourceFnArgs: {
        $,
        params,
      },
      resourceName: "news_articles",
      perPage: 25,
    });

    const articles = await utils.iterate(resourcesStream);
    $.export("$summary", `Successfully fetched ${articles.length} news articles.`);
    return articles;
  },
};
