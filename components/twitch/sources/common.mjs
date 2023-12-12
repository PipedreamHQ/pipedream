import twitch from "../twitch.app.mjs";
import { promisify } from "util";
const pause = promisify((delay, fn) => setTimeout(fn, delay));

export default {
  dedupe: "unique",
  props: {
    twitch,
    db: "$.service.db",
  },
  methods: {
    async *paginate(resourceFn, params, max = null) {
      let done = false;
      let count = 0;
      do {
        const {
          data, pagination,
        } = await this.retryFn(resourceFn, params);
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
        const delay = response
          ? response.headers["ratelimit-limit"]
          : 500;
        await pause(delay);
        return await this.retryFn(resourceFn, params, retries - 1);
      }
    },
  },
};
