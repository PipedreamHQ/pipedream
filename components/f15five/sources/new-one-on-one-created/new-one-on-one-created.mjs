import common from "../common/common.mjs";

export default {
  ...common,
  key: "f15five-new-one-on-one-created",
  name: "New 1-on-1 Created",
  description: "Emit new event for each new 1-on-1 created. [See the documentation](https://my.15five.com/api/public/#tag/1-on-1/paths/~1api~1public~1one-on-one~1/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.f15five,
        "user",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getResources(params) {
      const { results } = await this.f15five.listOneOnOnes({
        params: this.getParams(params),
      });
      return results;
    },
    getParams(params = {}) {
      return {
        ...params,
        user_id: this.user,
        order_by: "-id",
      };
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New 1-on-1 with ID ${event.id}`,
        ts: Date.parse(event.create_ts),
      };
    },
  },
};
