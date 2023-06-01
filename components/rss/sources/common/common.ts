import rss from "../../app/rss.app";

export default {
  props: {
    rss,
    db: "$.service.db",
    timer: {
      propDefinition: [
        rss,
        "timer",
      ],
    },
  },
  methods: {
    getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    generateMeta: function (item) {
      return {
        id: this.rss.itemKey(item),
        summary: item.title,
        ts: this.rss.itemTs(item),
      };
    },
  },
};

