import common from "./base-polling.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getOrderField() {
      return "lastmodified";
    },
    getTs(item) {
      return Date.parse(item.version.when);
    },
    // Version 1 is the creation itself, not an update.
    isRelevant(item) {
      return item.version.number > 1;
    },
    generateMeta(item) {
      return {
        id: `${item.id}-${item.version.number}`,
        summary: `${this.getContentType() === "page" ? "Page" : "Blogpost"} updated: ${item.title}`,
        ts: this.getTs(item),
      };
    },
  },
};
