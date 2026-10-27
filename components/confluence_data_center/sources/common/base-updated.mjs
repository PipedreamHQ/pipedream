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
      const type = this.getContentType();
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      return {
        id: `${item.id}-${item.version.number}`,
        summary: `${label} updated: ${item.title}`,
        ts: this.getTs(item),
      };
    },
  },
};
