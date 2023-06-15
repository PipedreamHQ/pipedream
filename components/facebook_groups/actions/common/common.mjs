import facebookGroups from "../../facebook_groups.app.mjs";

export default {
  props: {
    facebookGroups,
    group: {
      propDefinition: [
        facebookGroups,
        "group",
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
