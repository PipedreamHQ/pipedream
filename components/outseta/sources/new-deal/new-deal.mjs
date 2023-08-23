import base from "../common/base.mjs";

export default {
  ...base,
  key: "outseta-new-deal",
  name: "New Deal Added",
  description: "Emit new event when a deal is added. [See the documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#1a11d7f7-c4fd-cb3c-4d58-28ad0de39ee1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFn($) {
      return this.app.getAllDeals({
        $,
        limit: 100,
        params: {
          orderBy: "Created+DESC",
        },
      });
    },
    getMeta(item) {
      return {
        id: item.Uid,
        summary: `New Deal - ${item.Name}`,
        ts: new Date(item.Created),
      };
    },
  },
};
