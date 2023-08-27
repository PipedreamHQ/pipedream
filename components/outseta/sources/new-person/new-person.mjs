import base from "../common/base.mjs";

export default {
  ...base,
  key: "outseta-new-person",
  name: "New Person Added",
  description: "Emit new event when a person is added. [See the documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#68021219-0038-0214-2df5-d4a781cdbdf2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    listingFn($) {
      return this.app.getAllPeople({
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
        summary: `New Person - ${item.Email}`,
        ts: new Date(item.Created),
      };
    },
  },
};
