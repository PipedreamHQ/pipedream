import jotform from "../../jotform.app.mjs";

export default {
  props: {
    jotform,
  },
  methods: {
    async *paginate(resourceFn, {
      max, params = {}, ...options
    } = {}) {
      const { limit = 20 } = params;
      let { offset = 0 } = params;
      let count = 0;
      while (true) {
        const { content: items } = await resourceFn({
          ...options,
          params: {
            ...params,
            limit,
            offset,
          },
        });
        for (const item of items) {
          yield item;
          count ++;
          if (count >= max) {
            break;
          }
        }
        if (items.length < limit || count >= max) {
          return;
        }
        offset += limit;
      }
    },
  },
};
