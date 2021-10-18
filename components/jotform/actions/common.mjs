import jotform from "../jotform.app.mjs";

export default {
  props: {
    jotform,
  },
  methods: {
    async *paginate(resourceFn, params = {}) {
      while (true) {
        const { content: items } = await resourceFn(params);
        for (const item of items) {
          yield item;
        }
        const {
          limit = 20,
          offset = 0,
        } = params;
        if (items.length < limit) return;
        params.offset = offset + limit;
      }
    },
  },
};
