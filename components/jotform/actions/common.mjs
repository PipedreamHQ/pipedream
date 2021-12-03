import jotform from "../jotform.app.mjs";

export default {
  props: {
    jotform,
  },
  methods: {
    async *paginate(resourceFn, params = {}) {
      const { max } = params;
      delete params.max;
      let count = 0;
      while (true) {
        const { content: items } = await resourceFn(params);
        for (const item of items) {
          yield item;
          count ++;
          if (count >= max) {
            break;
          }
        }
        const {
          limit = 20,
          offset = 0,
        } = params;
        if (items.length < limit || count >= max) {
          return;
        }
        params.offset = offset + limit;
      }
    },
  },
};
