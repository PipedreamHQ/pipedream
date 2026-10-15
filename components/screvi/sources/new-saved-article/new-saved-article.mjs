import common from "../common/base.mjs";

export default {
  ...common,
  key: "screvi-new-saved-article",
  name: "New Saved Article",
  description: "Emit new event when an article is saved to your Screvi reading list. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    homeStatus: {
      propDefinition: [
        common.props.screvi,
        "homeStatus",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getParams(lastTs) {
      return {
        home_status: this.homeStatus,
        saved_since: lastTs,
        sort_by: "saved_at",
        order: "desc",
      };
    },
    fetch(opts) {
      return this.screvi.listArticles(opts);
    },
    getTs(article) {
      return article.saved_at;
    },
    generateMeta(article) {
      return {
        id: article.id,
        summary: `New article: ${article.title || article.url}`,
        ts: Date.parse(article.saved_at),
      };
    },
  },
};
