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
    async getResources({
      fn, args, maxResults,
    }) {
      const response = this.facebookGroups.paginate({
        fn,
        args,
      });

      const items = [];
      let count = 0;
      for await (const item of response) {
        items.push(item);
        if (maxResults && ++count === maxResults) {
          break;
        }
      }

      return items;
    },
  },
};
