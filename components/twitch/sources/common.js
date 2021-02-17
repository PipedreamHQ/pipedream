const twitch = require("../twitch.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    twitch,
    db: "$.service.db",
  },
  methods: {
    async paginate(resourceFn, params, type, max = null) {
      const items = [];
      let done = false;
      let count = 0;
      while (!done) {
        const { data, pagination } = await resourceFn(params);
        for (const item of data) {
          // if called from webhook component, get topics to return
          if (type == "webhook") {
            items.push(this.getTopicString(item));
          }
          // if called from polling component, emit data
          else if (type == "polling") {
            this.$emit(item, this.getMeta(item));
          }
          // if type is list, return list of items
          else if (type == "list") {
            items.push(item);
          }
          count++;
          if (max && count >= max) {
            done = true;
            break;
          }
        }
        // pass cursor to get next page of results; if no cursor, no more pages
        const { cursor } = pagination;
        if (!cursor) done = true;
        else params.after = cursor;
      }
      return items;
    },
  },
};