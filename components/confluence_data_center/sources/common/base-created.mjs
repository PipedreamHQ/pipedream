import common from "./base-polling.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getOrderField() {
      return "created";
    },
    getTs(item) {
      return Date.parse(item.history.createdDate);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New ${this.getContentType()} created: ${item.title}`,
        ts: this.getTs(item),
      };
    },
  },
};
