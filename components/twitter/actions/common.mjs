import twitter from "../twitter.app.mjs";

export default {
  props: {
    twitter,
  },
  methods: {
    async *paginate(resourceFn, params = {}, resourceType = null) {
      let cursor = true;
      while (cursor) {
        const results = await resourceFn(params);
        const items = resourceType
          ? results[resourceType]
          : results;
        for (const item of items) {
          yield item;
        }
        cursor = results.next_cursor;
        if (cursor) params.cursor = cursor;
      }
    },
  },
};
