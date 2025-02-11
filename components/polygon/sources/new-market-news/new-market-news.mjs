import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import polygon from "../../polygon.app.mjs";

export default {
  key: "polygon-new-market-news",
  name: "New Market News",
  description: "Emit new events when a news article related to the stock market is published. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    polygon,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    stockTicker: {
      propDefinition: [
        polygon,
        "stockTicker",
      ],
    },
    keywords: {
      propDefinition: [
        polygon,
        "keywords",
      ],
      optional: true,
    },
    newsStockTickers: {
      propDefinition: [
        polygon,
        "newsStockTickers",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const newsArticles = await this.polygon.getNewsArticles();
      const articles = newsArticles.results || [];

      // Sort by datetime ascending
      articles.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

      // Keep the last 50 articles
      const recentArticles = articles.slice(-50);

      for (const article of recentArticles) {
        this.$emit(
          article,
          {
            id: article.id || Date.parse(article.datetime),
            summary: article.title,
            ts: article.datetime
              ? Date.parse(article.datetime)
              : Date.now(),
          },
        );
      }

      if (recentArticles.length > 0) {
        const latestArticle = recentArticles[recentArticles.length - 1];
        const latestTimestamp = latestArticle.datetime
          ? Date.parse(latestArticle.datetime)
          : Date.now();
        await this.db.set("lastTimestamp", latestTimestamp);
      }
    },
    async activate() {
      // No specific activation logic required
    },
    async deactivate() {
      // No specific deactivation logic required
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;
    const newsArticles = await this.polygon.getNewsArticles();
    const articles = newsArticles.results || [];
    const newArticles = articles.filter((article) => article.datetime && Date.parse(article.datetime) > lastTimestamp);

    // Sort by datetime ascending
    newArticles.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    for (const article of newArticles) {
      this.$emit(
        article,
        {
          id: article.id || Date.parse(article.datetime),
          summary: article.title,
          ts: article.datetime
            ? Date.parse(article.datetime)
            : Date.now(),
        },
      );
    }

    if (newArticles.length > 0) {
      const latestArticle = newArticles[newArticles.length - 1];
      const latestTimestamp = latestArticle.datetime
        ? Date.parse(latestArticle.datetime)
        : Date.now();
      await this.db.set("lastTimestamp", latestTimestamp);
    }
  },
};
