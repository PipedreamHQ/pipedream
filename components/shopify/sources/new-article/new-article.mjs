import common from "../common/polling.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "shopify-new-article",
  name: "New Article",
  type: "source",
  description: "Emit new event for each new article in a blog.",
  version: "0.0.20",
  dedupe: "unique",
  props: {
    ...common.props,
    blogId: {
      propDefinition: [
        common.props.app,
        "blogId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResults() {
      const { blog: { articles: { nodes } } } = await this.app.listBlogArticles({
        id: this.blogId,
        first: MAX_LIMIT,
        reverse: true,
      });
      return nodes;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(article) {
      return {
        id: article.id,
        summary: `New Article: ${article.title}`,
        ts: Date.parse(article[this.getTsField()]),
      };
    },
  },
};
