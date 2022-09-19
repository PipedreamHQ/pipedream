import rss from "../../app/rss.app";

export default {
  props: {
    rss,
    timer: {
      propDefinition: [
        rss,
        "timer",
      ],
    },
  },
  methods: {
    generateMeta: function (item) {
      return {
        id: this.rss.itemKey(item),
        summary: item.title,
        ts: this.rss.itemTs(item),
      };
    },
  },
};

