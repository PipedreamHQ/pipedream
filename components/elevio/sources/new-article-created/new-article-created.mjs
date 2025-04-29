import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "elevio-new-article-created",
  name: "New Article Created",
  description: "Emit new event any time a new article is created. [See the documentation](https://api-docs.elevio.help/en/articles/71-rest-api-articles).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    sortFn(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    },
    getDateField() {
      return "created_at";
    },
    getResourceName() {
      return "articles";
    },
    getResourcesFn() {
      return this.app.listArticles;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Article: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
