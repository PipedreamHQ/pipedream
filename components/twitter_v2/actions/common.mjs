import twitter from "../twitter.app.mjs";

export default {
  props: {
    twitter,
  },
  methods: {
    async *paginate(resourceFn, params = {}, resourceType = null) {
      const { maxRequests = 1 } = params;
      delete params.maxResults;
      let count = 0;
      let cursor = true;
      while (cursor && count < maxRequests) {
        const results = await resourceFn(params);
        const items = resourceType
          ? results[resourceType]
          : results;
        for (const item of items) {
          yield item;
        }
        cursor = results.next_cursor;
        if (cursor) {
          params.cursor = cursor;
        }
        count++;
      }
    },
  },
};
