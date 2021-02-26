const twitch = require("../twitch.app.js");
const { promisify } = require("util");
const pause = promisify((delay, fn) => setTimeout(fn, delay));

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
    async retryFn(resourceFn, params, retries = 3) {
      let response;
      try {
        response = await resourceFn(params);
        return response.data;
      } catch (err) {
        if (retries <= 1) {
          throw new Error(err);
        }
        delay = response ? response.headers["ratelimit-limit"] : 500;
        await pause(delay);
        return await this.retryFn(resourceFn, params, retries - 1);
      }
    },
  },
};