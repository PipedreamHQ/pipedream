const twitch = require("../twitch.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    twitch,
    db: "$.service.db",
  },
  methods: {
    async *paginate(resourceFn, params, max = null) {
      const items = [];
      let done = false;
      let count = 0;
      do {
        const { data, pagination } = await this.retryFn(resourceFn, params);
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        // pass cursor to get next page of results; if no cursor, no more pages
        const { cursor } = pagination;
        params.after = cursor;
        done = !cursor;
      } while (!done);
    },
    async retryFn(resourceFn, params, retries = 3, back0ff = null) {
      try {
        const response = await resourceFn(params);
        if (response.status == 200) {
          return response.data;
        }
        if (retries > 0) {
          if (!backOff) backOff = response.headers["ratelimit-limit"];
          setTimeout(() => {
            return retryFn(resourceFn, params, retries - 1, backOff * 2);
          }, backoff);
        } else {
          throw new Error(response);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};