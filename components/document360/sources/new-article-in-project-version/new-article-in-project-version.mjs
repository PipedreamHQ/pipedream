import document360 from "../../document360.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "document360-new-article-in-project-version",
  name: "New Article in Project Version",
  description: "Emit new event when a new article is created within a project version. [See the documentation](https://apidocs.document360.com/apidocs/project-version-articles)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    document360,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectVersionId: {
      propDefinition: [
        document360,
        "projectVersionId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit the most recent 50 articles during the first run
      const articles = await this.document360.getArticles({
        projectVersionId: this.projectVersionId,
      });
      articles.slice(-50).forEach((article) => {
        this.$emit(article, {
          id: article.id,
          summary: article.title,
          ts: Date.parse(article.modified_at || article.created_at),
        });
      });
      // Save the timestamp of the last article processed
      const lastArticleTimestamp = articles.length > 0
        ? articles[0].modified_at
        : null;
      this.db.set("lastArticleTimestamp", lastArticleTimestamp);
    },
  },
  methods: {
    // Get the timestamp of the last article processed
    _getLastArticleTimestamp() {
      return this.db.get("lastArticleTimestamp") || 0;
    },
    // Save the timestamp of the last article processed
    _setLastArticleTimestamp(timestamp) {
      this.db.set("lastArticleTimestamp", timestamp);
    },
  },
  async run() {
    const lastArticleTimestamp = this._getLastArticleTimestamp();
    let maxTimestamp = lastArticleTimestamp;

    // Fetch articles updated since the last check
    const articles = await this.document360.getArticles({
      projectVersionId: this.projectVersionId,
    });
    articles.forEach((article) => {
      const articleTimestamp = Date.parse(article.modified_at || article.created_at);
      if (articleTimestamp > lastArticleTimestamp) {
        this.$emit(article, {
          id: article.id,
          summary: article.title,
          ts: articleTimestamp,
        });
        if (articleTimestamp > maxTimestamp) {
          maxTimestamp = articleTimestamp;
        }
      }
    });

    // Update the timestamp of the last article processed
    if (maxTimestamp !== lastArticleTimestamp) {
      this._setLastArticleTimestamp(maxTimestamp);
    }
  },
};
