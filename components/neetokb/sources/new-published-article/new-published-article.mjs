import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import neetokb from "../../neetokb.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "neetokb-new-published-article",
  name: "New Published Article",
  description: "Emit new event when a new article is published. [See the documentation](https://neetokb-apis.mintlify.app/api-reference/articles/list-articles).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    neetokb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getPublishedIds() {
      return this.db.get("publishedIds") || [];
    },
    _setPublishedIds(publishedIds) {
      this.db.set("publishedIds", publishedIds);
    },
    async emitEvent(maxResults = false) {
      const publishedIds = this._getPublishedIds();
      const response = this.neetokb.paginate({
        fn: this.neetokb.listArticles,
        params: {
          status: "published",
        },
      });

      const responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      let newArticles = responseArray.filter((article) => !publishedIds.includes(article.id));

      if (maxResults && newArticles.length > maxResults) {
        newArticles = newArticles.slice(0, maxResults);
      }

      for (const article of newArticles.reverse()) {
        const ts = new Date();
        this.$emit(article, {
          id: `${article.id}-${ts}`,
          summary: `New Published Article: ${article.title}`,
          ts,
        });
      }
      this._setPublishedIds(responseArray.map((article) => article.id));
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
