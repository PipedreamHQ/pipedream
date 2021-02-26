const spotify = require("../spotify.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    spotify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
    async *paginate(resourceFn, params={}) {
      params.limit = 20;
      params.offset = 0;
      let done = false;
      while (!done) {
        const results = await resourceFn(params);
        const { items } = results;
        for (const item of items) {
          yield item;
        }
        if (items.length < params.limit)
            done = true;
        params.offset += params.limit;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  },
}