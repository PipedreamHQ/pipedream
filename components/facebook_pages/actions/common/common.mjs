import facebookPages from "../../facebook_pages.app.mjs";

export default {
  props: {
    facebookPages,
    page: {
      propDefinition: [
        facebookPages,
        "page",
      ],
    },
  },
  methods: {
    async *paginate({
      fn, args = {},
    }) {
      do {
        const {
          data, paging,
        } = await fn(args);
        if (!data.length) {
          return;
        }
        for (const item of data) {
          yield item;
        }
        args = {
          ...args,
          params: {
            ...args.params,
            after: paging.cursors.after,
          },
        };
      } while (true);
    },
  },
};
