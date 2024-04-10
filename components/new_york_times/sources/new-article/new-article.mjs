import { axios } from "@pipedream/platform";
import new_york_times from "../../new_york_times.app.mjs";

export default {
  key: "new_york_times-new-article",
  name: "New Article Published",
  description: "Emits an event when a top article is published. [See the documentation](https://developer.nytimes.com/docs/articlesearch-product/1/routes/articlesearch.json/get)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    new_york_times,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 10, // 10 minutes
      },
    },
    facet: {
      propDefinition: [
        new_york_times,
        "facet",
      ],
    },
    facetFields: {
      propDefinition: [
        new_york_times,
        "facetFields",
      ],
    },
    facetFilter: {
      propDefinition: [
        new_york_times,
        "facetFilter",
      ],
    },
    fl: {
      propDefinition: [
        new_york_times,
        "fl",
      ],
    },
    fq: {
      propDefinition: [
        new_york_times,
        "fq",
      ],
    },
    q: {
      propDefinition: [
        new_york_times,
        "q",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch articles once on deployment, but do not emit them to avoid flooding
      await this.fetchAndEmitArticles(true);
    },
  },
  methods: {
    async fetchAndEmitArticles(isDeploy = false) {
      const lastEmitTimestamp = this.db.get("lastEmitTimestamp") || 0;
      const articles = await this.new_york_times.searchArticles({
        facet: this.facet,
        facetFields: this.facetFields,
        facetFilter: this.facetFilter,
        fl: this.fl,
        fq: this.fq,
        q: this.q,
      });

      articles.data.response.docs.forEach((article) => {
        const articleTimestamp = new Date(article.pub_date).getTime();
        if (articleTimestamp > lastEmitTimestamp) {
          this.$emit(article, {
            id: article._id,
            summary: article.headline.main,
            ts: articleTimestamp,
          });
          if (!isDeploy) {
            this.db.set("lastEmitTimestamp", articleTimestamp);
          }
        }
      });
    },
  },
  async run() {
    await this.fetchAndEmitArticles();
  },
};
